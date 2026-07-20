// src/app/api/create-payment-link/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const PDFDocument = require('pdfkit');

const GP_PROXY = 'https://solitary-hat-54ee.lfdweb123.workers.dev';
const GP_API_KEY = process.env.GENIUSPAY_API_KEY;
const GP_API_SECRET = process.env.GENIUSPAY_API_SECRET;
const DEPOSIT_RATE = 0.25; // 25% d'acompte

function generatePdfBuffer(applicationData: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
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
  });
}

function emailPaymentLink({ lang, orderId, depositAmount, currency, paymentUrl }: any) {
  const texts: Record<string, { subject: string; title: string; body: string; cta: string }> = {
    nl: {
      subject: `Betaal uw voorschot — ${orderId}`,
      title: 'Uw aanvraag is ontvangen',
      body: `Om uw dossier te valideren, gelieve het voorschot van <b>${depositAmount} ${currency}</b> (25% van het gevraagde bedrag) te betalen via de onderstaande link.`,
      cta: 'Nu betalen',
    },
    en: {
      subject: `Pay your deposit — ${orderId}`,
      title: 'Your application has been received',
      body: `To validate your file, please pay the deposit of <b>${depositAmount} ${currency}</b> (25% of the requested amount) via the link below.`,
      cta: 'Pay now',
    },
    es: {
      subject: `Pague su depósito — ${orderId}`,
      title: 'Su solicitud ha sido recibida',
      body: `Para validar su expediente, pague el depósito de <b>${depositAmount} ${currency}</b> (25% del importe solicitado) a través del siguiente enlace.`,
      cta: 'Pagar ahora',
    },
  };
  const t = texts[lang] || texts.en;

  return {
    subject: t.subject,
    html: `
      <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
      <body style="font-family:Arial,sans-serif;background:#f7f7f9;margin:0;padding:0;">
        <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.08);">
          <div style="background:#0e0e16;padding:32px;">
            <div style="font-size:22px;font-weight:800;color:#D4AF37;">FondsLink</div>
          </div>
          <div style="padding:32px;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#0e0e16;">${t.title}</h2>
            <p style="color:#555;font-size:14px;line-height:1.6;">${t.body}</p>
            <div style="background:#f7f7f9;border-radius:10px;padding:16px;margin:20px 0;">
              <div style="display:flex;justify-content:space-between;font-size:13px;">
                <span style="color:#8888a0;">Référence</span>
                <span style="font-weight:700;color:#D4AF37;font-family:monospace;">${orderId}</span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:13px;margin-top:8px;">
                <span style="color:#8888a0;">Acompte (25%)</span>
                <span style="font-weight:800;">${depositAmount} ${currency}</span>
              </div>
            </div>
            <a href="${paymentUrl}" style="display:inline-block;background:#D4AF37;color:#0e0e16;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;">
              ${t.cta}
            </a>
          </div>
        </div>
      </body></html>`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { applicationData, lang } = await req.json();

    if (!applicationData?.email || !applicationData?.amount) {
      return NextResponse.json({ success: false, message: 'Champs requis manquants' }, { status: 400 });
    }

    const amountRequested = parseFloat(applicationData.amount);
    const currency = applicationData.currency || 'EUR';
    const depositAmount = Math.round(amountRequested * DEPOSIT_RATE * 100) / 100;

    const orderId = 'FL-' + Date.now().toString(36).toUpperCase();

    // ── 1. Générer le contrat PDF et le stocker ─────────────
    const pdfBuffer = await generatePdfBuffer(applicationData);
    const pdfBase64 = pdfBuffer.toString('base64');
    const storageRef = ref(storage, `contracts/${applicationData.email}_${Date.now()}.pdf`);
    await uploadString(storageRef, pdfBase64, 'base64', { contentType: 'application/pdf' });
    const contractUrl = await getDownloadURL(storageRef);

    // ── 2. Créer le lien de paiement GeniusPay (pas de paiement direct) ──
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fondslink.com';

    const gpRes = await fetch(`${GP_PROXY}/api/v1/merchant/payments`, {
      method: 'POST',
      headers: {
        'X-API-Key': GP_API_KEY!,
        'X-API-Secret': GP_API_SECRET!,
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
        success_url: `${BASE_URL}/paiement-confirme?ref=${orderId}`,
        error_url: `${BASE_URL}/paiement-echoue?ref=${orderId}`,
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

    // ── 4. Envoyer le lien par email via Brevo ──────────────
    const { subject, html } = emailPaymentLink({
      lang,
      orderId,
      depositAmount,
      currency,
      paymentUrl,
    });

    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: 'FondsLink',
          email:
            lang === 'nl'
              ? process.env.BREVO_CONTACT_EMAIL_NL
              : lang === 'en'
              ? process.env.BREVO_CONTACT_EMAIL_EN
              : process.env.BREVO_CONTACT_EMAIL_ES,
        },
        to: [{ email: applicationData.email }],
        subject,
        htmlContent: html,
      }),
    });

    // Email admin (optionnel)
    if (process.env.ADMIN_EMAIL) {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY! },
        body: JSON.stringify({
          sender: { name: 'FondsLink', email: process.env.SHOP_EMAIL || 'noreply@fondslink.com' },
          to: [{ email: process.env.ADMIN_EMAIL }],
          subject: `Nouvelle demande de prêt — ${orderId}`,
          htmlContent: `<p>Nouveau dossier <b>${orderId}</b><br>Client: ${applicationData.firstName} ${applicationData.lastName}<br>Montant: ${amountRequested} ${currency}<br>Acompte: ${depositAmount} ${currency}</p>`,
        }),
      });
    }

    // ── 5. Retourner le lien pour affichage sur la page ─────
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
