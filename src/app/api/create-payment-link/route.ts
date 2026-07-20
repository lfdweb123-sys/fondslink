// src/app/api/create-payment-link/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// IMPORTANT : force le runtime Node.js (pdfkit ne fonctionne pas sur l'Edge runtime,
// et c'est la cause la plus probable de "A is not a constructor")
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// require() dynamique — évite les soucis de bundling ESM/CJS de Turbopack
const PDFDocument = require('pdfkit').default || require('pdfkit');

const GP_PROXY = process.env.GENIUSPAY_PROXY_URL || 'https://solitary-hat-54ee.lfdweb123.workers.dev';
const GP_API_KEY = process.env.GENIUSPAY_API_KEY;
const GP_API_SECRET = process.env.GENIUSPAY_API_SECRET;
const DEPOSIT_RATE = 0.25; // 25% d'acompte

type Lang = 'nl' | 'en' | 'es';

// ─────────────────────────────────────────────
// Traductions email (lien de paiement)
// ─────────────────────────────────────────────
const emailTexts: Record<Lang, { subject: string; title: string; body: string; cta: string; ref: string; deposit: string; footerNote: string }> = {
  nl: {
    subject: 'Betaal uw voorschot',
    title: 'Uw aanvraag is ontvangen',
    body: 'Om uw dossier te valideren, gelieve het voorschot van',
    cta: 'Nu betalen',
    ref: 'Referentie',
    deposit: 'Voorschot (25%)',
    footerNote: 'te betalen via onderstaande link.',
  },
  en: {
    subject: 'Pay your deposit',
    title: 'Your application has been received',
    body: 'To validate your file, please pay the deposit of',
    cta: 'Pay now',
    ref: 'Reference',
    deposit: 'Deposit (25%)',
    footerNote: 'via the link below.',
  },
  es: {
    subject: 'Pague su depósito',
    title: 'Su solicitud ha sido recibida',
    body: 'Para validar su expediente, pague el depósito de',
    cta: 'Pagar ahora',
    ref: 'Referencia',
    deposit: 'Depósito (25%)',
    footerNote: 'a través del siguiente enlace.',
  },
};

// ─────────────────────────────────────────────
// Traductions email admin (notification interne)
// ─────────────────────────────────────────────
const adminEmailTexts: Record<Lang, { subject: string; title: string; client: string; amount: string; deposit: string }> = {
  nl: { subject: 'Nieuwe leningaanvraag', title: 'Nieuw dossier ontvangen', client: 'Klant', amount: 'Gevraagd bedrag', deposit: 'Voorschot' },
  en: { subject: 'New loan application', title: 'New file received', client: 'Client', amount: 'Amount requested', deposit: 'Deposit' },
  es: { subject: 'Nueva solicitud de préstamo', title: 'Nuevo expediente recibido', client: 'Cliente', amount: 'Importe solicitado', deposit: 'Depósito' },
};

function getLang(lang: string): Lang {
  return (['nl', 'en', 'es'] as const).includes(lang as Lang) ? (lang as Lang) : 'nl';
}

function generatePdfBuffer(applicationData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = new PDFDocument();
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);

      pdfDoc.fontSize(16).text('LOAN AGREEMENT - FONDSLINK', { align: 'center' });
      pdfDoc.moveDown();
      pdfDoc.fontSize(12).text(`Borrower: ${applicationData.firstName} ${applicationData.lastName}`);
      pdfDoc.text(`Amount requested: ${applicationData.amount} ${applicationData.currency}`);
      pdfDoc.text(`Duration: ${applicationData.duration} months`);
      pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`);
      pdfDoc.moveDown(2);
      pdfDoc.text('By signing electronically, the Borrower confirms that all information provided is complete and accurate.');
      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
}

function buildPaymentEmailHtml(lang: Lang, orderId: string, depositAmount: number, currency: string, paymentUrl: string) {
  const t = emailTexts[lang];
  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f7f7f9;margin:0;padding:0;">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">
        <div style="background:#0e0e16;padding:32px;">
          <div style="font-size:22px;font-weight:800;color:#D4AF37;">FondsLink</div>
        </div>
        <div style="padding:32px;">
          <h2 style="margin:0 0 12px;font-size:20px;color:#0e0e16;">${t.title}</h2>
          <p style="color:#555;font-size:14px;line-height:1.6;">
            ${t.body} <b>${depositAmount} ${currency}</b> ${t.footerNote}
          </p>
          <div style="background:#f7f7f9;border-radius:10px;padding:16px;margin:20px 0;">
            <div style="display:flex;justify-content:space-between;font-size:13px;">
              <span style="color:#8888a0;">${t.ref}</span>
              <span style="font-weight:700;color:#D4AF37;font-family:monospace;">${orderId}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:8px;">
              <span style="color:#8888a0;">${t.deposit}</span>
              <span style="font-weight:800;">${depositAmount} ${currency}</span>
            </div>
          </div>
          <a href="${paymentUrl}" style="display:inline-block;background:#D4AF37;color:#0e0e16;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
            ${t.cta}
          </a>
        </div>
      </div>
    </body></html>`;
}

function buildAdminEmailHtml(lang: Lang, orderId: string, applicationData: any, depositAmount: number, currency: string) {
  const t = adminEmailTexts[lang];
  return `
    <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
    <body style="font-family:Arial,sans-serif;background:#f7f7f9;margin:0;padding:0;">
      <div style="max-width:480px;margin:32px auto;background:white;border-radius:12px;padding:28px;">
        <div style="font-size:16px;font-weight:800;color:#D4AF37;margin-bottom:14px;">${t.title}</div>
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr><td style="color:#888;padding:4px 0;">${t.client}</td><td style="font-weight:700;">${applicationData.firstName} ${applicationData.lastName}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">${t.amount}</td><td style="font-weight:700;">${applicationData.amount} ${currency}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">${t.deposit}</td><td style="font-weight:800;color:#D4AF37;">${depositAmount} ${currency}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">Réf.</td><td style="font-family:monospace;">${orderId}</td></tr>
        </table>
      </div>
    </body></html>`;
}

async function sendBrevoEmail({ to, subject, html, senderEmail }: { to: string; subject: string; html: string; senderEmail: string }) {
  if (!process.env.BREVO_API_KEY || !to) return;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
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

function getSenderEmail(lang: Lang) {
  return (
    (lang === 'nl'
      ? process.env.BREVO_CONTACT_EMAIL_NL
      : lang === 'en'
      ? process.env.BREVO_CONTACT_EMAIL_EN
      : process.env.BREVO_CONTACT_EMAIL_ES) ||
    process.env.SHOP_EMAIL ||
    'noreply@fondslink.com'
  );
}

export async function POST(req: NextRequest) {
  try {
    const { applicationData, lang: rawLang } = await req.json();
    const lang = getLang(rawLang);

    if (!applicationData?.email || !applicationData?.amount || !applicationData?.firstName) {
      return NextResponse.json({ success: false, message: 'Champs requis manquants' }, { status: 400 });
    }

    const amountRequested = parseFloat(applicationData.amount);
    if (isNaN(amountRequested) || amountRequested <= 0) {
      return NextResponse.json({ success: false, message: 'Montant invalide' }, { status: 400 });
    }

    const currency = applicationData.currency || 'EUR';
    const depositAmount = Math.round(amountRequested * DEPOSIT_RATE * 100) / 100;

    const orderId = 'FL-' + Date.now().toString(36).toUpperCase();

    // ── 1. Générer le contrat PDF et le stocker ─────────────
    let contractUrl = '';
    try {
      const pdfBuffer = await generatePdfBuffer(applicationData);
      const pdfBase64 = pdfBuffer.toString('base64');
      const storageRef = ref(storage, `contracts/${applicationData.email}_${Date.now()}.pdf`);
      await uploadString(storageRef, pdfBase64, 'base64', { contentType: 'application/pdf' });
      contractUrl = await getDownloadURL(storageRef);
    } catch (pdfErr) {
      // Le PDF n'est pas bloquant pour la génération du lien de paiement
      console.error('⚠️ PDF generation error (non-blocking):', pdfErr);
    }

    // ── 2. Créer le lien de paiement GeniusPay (pas de paiement direct) ──
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fondslink.com';

    if (!GP_API_KEY || !GP_API_SECRET) {
      console.error('❌ Missing GENIUSPAY_API_KEY / GENIUSPAY_API_SECRET env vars');
      return NextResponse.json({ success: false, message: 'Configuration de paiement manquante' }, { status: 500 });
    }

    const gpRes = await fetch(`${GP_PROXY}/api/v1/merchant/payments`, {
      method: 'POST',
      headers: {
        'X-API-Key': GP_API_KEY,
        'X-API-Secret': GP_API_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: depositAmount,
        currency,
        description: `FondsLink — Acompte 25% dossier ${orderId}`,
        customer: {
          name: `${applicationData.firstName} ${applicationData.lastName}`.trim(),
          email: applicationData.email,
          phone: applicationData.phone,
        },
        success_url: `${BASE_URL}/${lang}/paiement-confirme?ref=${orderId}`,
        error_url: `${BASE_URL}/${lang}/paiement-echoue?ref=${orderId}`,
        metadata: {
          order_id: orderId,
          order_reference: orderId,
          gp_reference: orderId,
          source: 'fondslink',
          type: 'loan_deposit',
        },
      }),
    });

    const contentType = gpRes.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const raw = await gpRes.text();
      console.error('❌ GeniusPay non-JSON response:', raw.slice(0, 300));
      return NextResponse.json({ success: false, message: 'Erreur de génération du lien de paiement' }, { status: 502 });
    }

    const gpData = await gpRes.json();

    if (!gpRes.ok || !gpData.success) {
      console.error('❌ GeniusPay error:', gpData);
      return NextResponse.json(
        { success: false, message: gpData?.error?.message || 'Paiement indisponible' },
        { status: 502 }
      );
    }

    const gpPayment = gpData.data;
    const gpReference = gpPayment.reference || gpPayment.payment_reference || gpPayment.id || orderId;
    const paymentUrl = gpPayment.checkout_url || gpPayment.payment_url;

    if (!paymentUrl) {
      console.error('❌ No payment URL returned by GeniusPay');
      return NextResponse.json({ success: false, message: 'Lien de paiement indisponible' }, { status: 502 });
    }

    // ── 3. Sauvegarder le dossier dans Firestore ────────────
    await setDoc(doc(collection(db, 'applications'), orderId), {
      orderId,
      ...applicationData,
      amountRequested,
      depositAmount,
      depositRate: DEPOSIT_RATE,
      currency,
      contractUrl,
      paymentUrl,
      gpReference,
      status: 'pending_payment',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      lang,
    });

    // ── 4. Envoyer le lien par email via Brevo (client) ─────
    const senderEmail = getSenderEmail(lang);
    await sendBrevoEmail({
      to: applicationData.email,
      subject: `${emailTexts[lang].subject} — ${orderId}`,
      html: buildPaymentEmailHtml(lang, orderId, depositAmount, currency, paymentUrl),
      senderEmail,
    });

    // ── 5. Email admin (optionnel) ───────────────────────────
    if (process.env.ADMIN_EMAIL) {
      await sendBrevoEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `${adminEmailTexts[lang].subject} — ${orderId}`,
        html: buildAdminEmailHtml(lang, orderId, applicationData, depositAmount, currency),
        senderEmail: process.env.SHOP_EMAIL || senderEmail,
      });
    }

    // ── 6. Retourner le lien pour affichage sur la page ─────
    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl,
      depositAmount,
      currency,
      contractUrl,
    });
  } catch (error) {
    console.error('❌ create-payment-link error:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
