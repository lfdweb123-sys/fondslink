// src/app/api/geniuspay-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Lang = 'nl' | 'en' | 'es';

const confirmedEmailTexts: Record<Lang, { subject: string; title: string; body: string }> = {
  nl: {
    subject: 'Voorschot bevestigd',
    title: 'Betaling bevestigd',
    body: 'Uw voorschot voor dossier {orderId} is goed ontvangen. Uw dossier wordt momenteel gevalideerd.',
  },
  en: {
    subject: 'Deposit confirmed',
    title: 'Payment confirmed',
    body: 'Your deposit for file {orderId} has been received. Your file is now being validated.',
  },
  es: {
    subject: 'Depósito confirmado',
    title: 'Pago confirmado',
    body: 'Su depósito para el expediente {orderId} ha sido recibido. Su expediente está siendo validado.',
  },
};

const failedEmailTexts: Record<Lang, { subject: string; title: string; body: string }> = {
  nl: {
    subject: 'Betaling mislukt',
    title: 'Betaling niet gelukt',
    body: 'De betaling voor dossier {orderId} is mislukt of geannuleerd. Probeer het a.u.b. opnieuw.',
  },
  en: {
    subject: 'Payment failed',
    title: 'Payment unsuccessful',
    body: 'The payment for file {orderId} failed or was cancelled. Please try again.',
  },
  es: {
    subject: 'Pago fallido',
    title: 'Pago no realizado',
    body: 'El pago para el expediente {orderId} falló o fue cancelado. Inténtelo de nuevo.',
  },
};

function getLang(lang: string | undefined): Lang {
  return (['nl', 'en', 'es'] as const).includes(lang as Lang) ? (lang as Lang) : 'nl';
}

function buildStatusEmailHtml(title: string, body: string) {
  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f7f7f9;margin:0;padding:0;">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">
        <div style="background:#0e0e16;padding:32px;">
          <div style="font-size:22px;font-weight:800;color:#D4AF37;">FondsLink</div>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 12px;font-size:20px;color:#0e0e16;">${title}</h2>
          <p style="color:#555;font-size:14px;line-height:1.6;">${body}</p>
        </div>
      </div>
    </body></html>`;
}

async function sendBrevoEmail({ to, subject, html, senderEmail }: { to: string; subject: string; html: string; senderEmail: string }) {
  if (!process.env.BREVO_API_KEY || !to) return;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY },
    body: JSON.stringify({
      sender: { name: 'FondsLink', email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    console.error('❌ Brevo error:', await res.text());
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const event = (body.event || body.status || '').toLowerCase();
    const data = body.data || body;

    const reference = data?.reference || data?.metadata?.order_reference || data?.metadata?.order_id;

    const paidEvents = ['payment.success', 'payment.completed', 'completed', 'success', 'paid'];
    const failedEvents = ['payment.failed', 'payment.cancelled', 'payment.expired', 'failed', 'cancelled', 'expired'];

    if (event === 'webhook.test') {
      return NextResponse.json({ received: true, test: true });
    }

    if (!reference) {
      return NextResponse.json({ received: true, note: 'no reference' });
    }

    const q = query(collection(db, 'applications'), where('gpReference', '==', reference));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ received: true, note: 'application not found' });
    }

    const appDoc = snapshot.docs[0];
    const appData = appDoc.data();

    // Anti-duplicat
    if (appData.paymentStatus === 'paid' && paidEvents.includes(event)) {
      return NextResponse.json({ ignored: true });
    }

    const lang = getLang(appData.lang);
    const senderEmail =
      (lang === 'nl'
        ? process.env.BREVO_CONTACT_EMAIL_NL
        : lang === 'en'
        ? process.env.BREVO_CONTACT_EMAIL_EN
        : process.env.BREVO_CONTACT_EMAIL_ES) ||
      process.env.SHOP_EMAIL ||
      'noreply@fondslink.com';

    if (paidEvents.includes(event)) {
      await updateDoc(doc(db, 'applications', appDoc.id), {
        status: 'deposit_paid',
        paymentStatus: 'paid',
        paidAt: new Date(),
        updatedAt: new Date(),
        geniuspayData: data,
      });

      if (appData.email) {
        const t = confirmedEmailTexts[lang];
        await sendBrevoEmail({
          to: appData.email,
          subject: `${t.subject} — ${appData.orderId}`,
          html: buildStatusEmailHtml(t.title, t.body.replace('{orderId}', appData.orderId)),
          senderEmail,
        });
      }
    } else if (failedEvents.includes(event)) {
      await updateDoc(doc(db, 'applications', appDoc.id), {
        status: 'payment_failed',
        paymentStatus: 'failed',
        updatedAt: new Date(),
        geniuspayData: data,
      });

      if (appData.email) {
        const t = failedEmailTexts[lang];
        await sendBrevoEmail({
          to: appData.email,
          subject: `${t.subject} — ${appData.orderId}`,
          html: buildStatusEmailHtml(t.title, t.body.replace('{orderId}', appData.orderId)),
          senderEmail,
        });
      }
    } else {
      return NextResponse.json({ received: true, note: 'unhandled event' });
    }

    return NextResponse.json({ received: true, updated: appDoc.id });
  } catch (err) {
    console.error('🔥 Webhook error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
