// src/app/api/brevo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// Chargement dynamique pour éviter les erreurs de build Turbopack/TypeScript
const PDFDocument = require('pdfkit');

type Lang = 'nl' | 'en' | 'es';

function getLang(lang: string): Lang {
  return (['nl', 'en', 'es'] as const).includes(lang as Lang) ? (lang as Lang) : 'nl';
}

// ─────────────────────────────────────────────
// Traductions email client
// ─────────────────────────────────────────────
const emailTexts = {
  loan: {
    nl: {
      subject: 'Betaal uw voorschot',
      title: 'Uw leningaanvraag is ontvangen',
      body: 'Om uw dossier te valideren, gelieve het voorschot van',
      cta: 'Nu betalen',
      ref: 'Referentie',
      deposit: 'Voorschot (25%)',
      footerNote: 'te betalen via onderstaande link.',
      securePayment: '🔒 Betaling beveiligd volgens DSP2 (sterke authenticatie 3D Secure)',
      withdrawal: 'U heeft 14 dagen na de ondertekening om zonder boete af te zien.',
    },
    en: {
      subject: 'Pay your deposit',
      title: 'Your loan application has been received',
      body: 'To validate your file, please pay the deposit of',
      cta: 'Pay now',
      ref: 'Reference',
      deposit: 'Deposit (25%)',
      footerNote: 'via the link below.',
      securePayment: '🔒 Payment secured according to DSP2 (3D Secure strong authentication)',
      withdrawal: 'You have 14 days after signing to cancel without penalty.',
    },
    es: {
      subject: 'Pague su depósito',
      title: 'Su solicitud de préstamo ha sido recibida',
      body: 'Para validar su expediente, pague el depósito de',
      cta: 'Pagar ahora',
      ref: 'Referencia',
      deposit: 'Depósito (25%)',
      footerNote: 'a través del siguiente enlace.',
      securePayment: '🔒 Pago seguro según DSP2 (autenticación fuerte 3D Secure)',
      withdrawal: 'Dispone de 14 días después de la firma para desistir sin penalización.',
    },
  },
  insurance: {
    nl: {
      subject: 'Betaal uw voorschot verzekering',
      title: 'Uw verzekeringsaanvraag is ontvangen',
      body: 'Om uw dossier te valideren, gelieve het voorschot van',
      cta: 'Nu betalen',
      ref: 'Referentie',
      deposit: 'Voorschot (25%)',
      footerNote: 'te betalen via onderstaande link.',
      securePayment: '🔒 Betaling beveiligd volgens DSP2 (sterke authenticatie 3D Secure)',
      withdrawal: 'U heeft 14 dagen na de ondertekening om zonder boete af te zien.',
    },
    en: {
      subject: 'Pay your insurance deposit',
      title: 'Your insurance application has been received',
      body: 'To validate your file, please pay the deposit of',
      cta: 'Pay now',
      ref: 'Reference',
      deposit: 'Deposit (25%)',
      footerNote: 'via the link below.',
      securePayment: '🔒 Payment secured according to DSP2 (3D Secure strong authentication)',
      withdrawal: 'You have 14 days after signing to cancel without penalty.',
    },
    es: {
      subject: 'Pague su depósito de seguro',
      title: 'Su solicitud de seguro ha sido recibida',
      body: 'Para validar su expediente, pague el depósito de',
      cta: 'Pagar ahora',
      ref: 'Referencia',
      deposit: 'Depósito (25%)',
      footerNote: 'a través del siguiente enlace.',
      securePayment: '🔒 Pago seguro según DSP2 (autenticación fuerte 3D Secure)',
      withdrawal: 'Dispone de 14 días después de la firma para desistir sin penalización.',
    },
  },
};

// ─────────────────────────────────────────────
// Traductions email admin
// ─────────────────────────────────────────────
const adminEmailTexts = {
  loan: {
    nl: { subject: 'Nieuwe leningaanvraag', title: 'Nieuw dossier ontvangen', client: 'Klant', amount: 'Gevraagd bedrag', deposit: 'Voorschot' },
    en: { subject: 'New loan application', title: 'New file received', client: 'Client', amount: 'Amount requested', deposit: 'Deposit' },
    es: { subject: 'Nueva solicitud de préstamo', title: 'Nuevo expediente recibido', client: 'Cliente', amount: 'Importe solicitado', deposit: 'Depósito' },
  },
  insurance: {
    nl: { subject: 'Nieuwe verzekeringsaanvraag', title: 'Nieuw dossier ontvangen', client: 'Klant', amount: 'Jaarlijkse premie', deposit: 'Voorschot' },
    en: { subject: 'New insurance application', title: 'New file received', client: 'Client', amount: 'Annual premium', deposit: 'Deposit' },
    es: { subject: 'Nueva solicitud de seguro', title: 'Nuevo expediente recibido', client: 'Cliente', amount: 'Prima anual', deposit: 'Depósito' },
  },
};

function getEmailTexts(type: 'loan' | 'insurance', lang: Lang) {
  return emailTexts[type][lang];
}

function getAdminEmailTexts(type: 'loan' | 'insurance', lang: Lang) {
  return adminEmailTexts[type][lang];
}

// ─────────────────────────────────────────────
// Génération du PDF
// ─────────────────────────────────────────────
function generatePdfBuffer(applicationData: any, type: 'loan' | 'insurance'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = new PDFDocument();
      const chunks: Buffer[] = [];

      pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.on('error', reject);

      // Titre
      pdfDoc.fontSize(16).text(
        type === 'loan' ? 'LOAN AGREEMENT - FONDSLINK' : 'INSURANCE CONTRACT - FONDSLINK',
        { align: 'center' }
      );
      pdfDoc.moveDown();

      // Infos client
      pdfDoc.fontSize(12);
      pdfDoc.text(`Client: ${applicationData.firstName} ${applicationData.lastName}`);
      pdfDoc.text(`Email: ${applicationData.email}`);
      pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`);
      pdfDoc.moveDown();

      if (type === 'loan') {
        pdfDoc.text(`Amount requested: ${applicationData.amount} ${applicationData.currency}`);
        pdfDoc.text(`Duration: ${applicationData.duration} months`);
        pdfDoc.text(`Monthly income: ${applicationData.monthlyIncome} ${applicationData.currency}`);
      } else {
        pdfDoc.text(`Insurance type: ${applicationData.insuranceType === 'vehicle' ? 'Vehicle' : 'Home'}`);
        pdfDoc.text(`Coverage level: ${applicationData.coverageLevel}`);
        
        if (applicationData.insuranceType === 'vehicle') {
          pdfDoc.text(`Vehicle: ${applicationData.brand} ${applicationData.model} (${applicationData.year})`);
          pdfDoc.text(`Plate number: ${applicationData.plateNumber}`);
        } else {
          pdfDoc.text(`Property type: ${applicationData.propertyType}`);
          pdfDoc.text(`Surface area: ${applicationData.surfaceArea} m²`);
        }
      }

      pdfDoc.moveDown(2);
      
      // Mentions légales
      pdfDoc.fontSize(10);
      pdfDoc.text('________________________________________');
      pdfDoc.moveDown();
      pdfDoc.text('MENTIONS LÉGALES OBLIGATOIRES', { align: 'center' });
      pdfDoc.moveDown();
      pdfDoc.text('Droit de rétractation : Conformément à la loi, vous disposez d\'un délai de 14 jours à compter de la conclusion du contrat pour revenir sur votre décision, sans pénalité.');
      pdfDoc.moveDown();
      pdfDoc.text('Protection des données : Vos données personnelles sont traitées conformément au RGPD. Vous disposez d\'un droit d\'accès, de rectification, de suppression et d\'opposition.');
      pdfDoc.moveDown();
      pdfDoc.text('Conformité : Ce contrat est conforme à la Directive sur la Distribution d\'Assurances (IDD) et à la réglementation européenne en vigueur.');
      pdfDoc.moveDown();
      pdfDoc.text('By signing electronically, the client confirms that all information provided is complete and accurate.');
      pdfDoc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ─────────────────────────────────────────────
// Construction des emails HTML
// ─────────────────────────────────────────────
function buildPaymentEmailHtml(
  type: 'loan' | 'insurance',
  lang: Lang,
  orderId: string,
  depositAmount: number,
  currency: string,
  paymentUrl: string
) {
  const t = getEmailTexts(type, lang);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
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
          
          <!-- 🔒 Mentions légales et sécurité -->
          <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#888;text-align:center;">
            <p style="margin:5px 0;">🔒 ${t.securePayment}</p>
            <p style="margin:5px 0;">📋 ${t.withdrawal}</p>
            <p style="margin:5px 0;">
              Conformément au RGPD, vos données sont traitées en toute sécurité. 
              <a href="https://fondslink.com/privacy" style="color:#D4AF37;text-decoration:underline;">Politique de confidentialité</a>
            </p>
            <p style="margin:5px 0;font-size:10px;color:#aaa;">
              FondsLink - ${new Date().getFullYear()} - Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>`;
}

function buildAdminEmailHtml(
  type: 'loan' | 'insurance',
  lang: Lang,
  orderId: string,
  applicationData: any,
  depositAmount: number,
  currency: string
) {
  const t = getAdminEmailTexts(type, lang);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="font-family:Arial,sans-serif;background:#f7f7f9;margin:0;padding:0;">
      <div style="max-width:480px;margin:32px auto;background:white;border-radius:12px;padding:28px;">
        <div style="font-size:16px;font-weight:800;color:#D4AF37;margin-bottom:14px;">${t.title}</div>
        <div style="background:#f0f7ff;border-left:4px solid #D4AF37;padding:12px;margin-bottom:16px;font-size:12px;color:#555;">
          🔒 Paiement conforme DSP2 - Authentification forte 3D Secure
        </div>
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr><td style="color:#888;padding:4px 0;">${t.client}</td><td style="font-weight:700;">${applicationData.firstName} ${applicationData.lastName}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">${t.amount}</td><td style="font-weight:700;">${
            type === 'loan' 
              ? `${applicationData.amount} ${currency}` 
              : `${(depositAmount / 0.25).toFixed(2)} ${currency}`
          }</td></tr>
          <tr><td style="color:#888;padding:4px 0;">${t.deposit}</td><td style="font-weight:800;color:#D4AF37;">${depositAmount} ${currency}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">Type</td><td style="font-weight:700;">${type === 'loan' ? 'Prêt' : 'Assurance'}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">Réf.</td><td style="font-family:monospace;">${orderId}</td></tr>
          <tr><td style="color:#888;padding:4px 0;">RGPD</td><td style="font-weight:700;color:green;">✅ Consentement obtenu</td></tr>
        </table>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999;">
          <p>📋 Délai de rétractation : 14 jours</p>
          <p>🔒 Paiement sécurisé 3D Secure</p>
        </div>
      </div>
    </body>
    </html>`;
}

// ─────────────────────────────────────────────
// Fonction d'envoi d'email Brevo
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Route principale
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { applicationData, lang: rawLang, type, depositAmount, currency, orderId, paymentUrl } = await req.json();

    if (!applicationData?.email) {
      return NextResponse.json({ success: false, message: 'Email requis' }, { status: 400 });
    }

    const lang = getLang(rawLang);
    const requestType = type === 'insurance' ? 'insurance' : 'loan';

    // 1. Générer le PDF
    let contractUrl = '';
    try {
      const pdfBuffer = await generatePdfBuffer(applicationData, requestType);
      const pdfBase64 = pdfBuffer.toString('base64');
      const storageRef = ref(storage, `contracts/${requestType}/${applicationData.email}_${Date.now()}.pdf`);
      await uploadString(storageRef, pdfBase64, 'base64', { contentType: 'application/pdf' });
      contractUrl = await getDownloadURL(storageRef);
    } catch (pdfErr) {
      console.error('⚠️ PDF generation error (non-blocking):', pdfErr);
    }

    // 2. Sauvegarder dans Firestore avec le contrat URL
    const docRef = doc(collection(db, 'applications'), orderId);
    await setDoc(docRef, {
      orderId,
      type: requestType,
      ...applicationData,
      depositAmount,
      depositRate: 0.25,
      currency: currency || 'EUR',
      contractUrl,
      paymentUrl,
      status: 'pending_payment',
      paymentStatus: 'pending',
      gdprConsent: applicationData.acceptGDPR || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lang,
      // Mention des droits
      withdrawalRight: '14 jours',
      securePayment: 'DSP2 3D Secure',
    });

    // 3. Envoyer l'email client
    const senderEmail = getSenderEmail(lang);
    await sendBrevoEmail({
      to: applicationData.email,
      subject: `${getEmailTexts(requestType, lang).subject} — ${orderId}`,
      html: buildPaymentEmailHtml(requestType, lang, orderId, depositAmount, currency || 'EUR', paymentUrl),
      senderEmail,
    });

    // 4. Envoyer l'email admin
    if (process.env.ADMIN_EMAIL) {
      await sendBrevoEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `${getAdminEmailTexts(requestType, lang).subject} — ${orderId}`,
        html: buildAdminEmailHtml(requestType, lang, orderId, applicationData, depositAmount, currency || 'EUR'),
        senderEmail: process.env.SHOP_EMAIL || senderEmail,
      });
    }

    return NextResponse.json({
      success: true,
      contractUrl,
      orderId,
    });
  } catch (error) {
    console.error('❌ Brevo API Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
