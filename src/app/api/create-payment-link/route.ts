// src/app/api/create-payment-link/route.ts
import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT : force le runtime Node.js (pdfkit ne fonctionne pas sur l'Edge runtime)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GP_PROXY = process.env.GENIUSPAY_PROXY_URL || 'https://solitary-hat-54ee.lfdweb123.workers.dev';
const GP_API_KEY = process.env.GENIUSPAY_API_KEY;
const GP_API_SECRET = process.env.GENIUSPAY_API_SECRET;
const DEPOSIT_RATE = 0.25; // 25% d'acompte

type Lang = 'nl' | 'en' | 'es';
type RequestType = 'loan' | 'insurance';

// ─────────────────────────────────────────────
// Tarifs des assurances (prix mensuel fictifs)
// ─────────────────────────────────────────────
const MONTHLY_PREMIUM: Record<string, number> = {
  basic: 15,
  standard: 29,
  premium: 49,
};

// ─────────────────────────────────────────────
// Fonctions utilitaires
// ─────────────────────────────────────────────
function getLang(lang: string): Lang {
  return (['nl', 'en', 'es'] as const).includes(lang as Lang) ? (lang as Lang) : 'nl';
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
// Envoi vers Brevo
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

// ─────────────────────────────────────────────
// Route POST principale
// ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { applicationData, lang: rawLang } = await req.json();
    const lang = getLang(rawLang);

    // Validation commune
    if (!applicationData?.email || !applicationData?.firstName) {
      return NextResponse.json({ success: false, message: 'Champs requis manquants' }, { status: 400 });
    }

    // ── 1. Déterminer le type de demande ──
    const isInsurance = !!applicationData.insuranceType;
    const type: RequestType = isInsurance ? 'insurance' : 'loan';
    const currency = applicationData.currency || 'EUR';

    let amountToCharge: number; // Montant de l'acompte (25%)
    let description: string;

    if (isInsurance) {
      const monthlyPremium = MONTHLY_PREMIUM[applicationData.coverageLevel] || MONTHLY_PREMIUM.standard;
      const annualPremium = monthlyPremium * 12;
      amountToCharge = Math.round(annualPremium * DEPOSIT_RATE * 100) / 100;
      description = `FondsLink — Acompte 25% assurance ${applicationData.insuranceType}`;
    } else {
      const amountRequested = parseFloat(applicationData.amount);
      if (isNaN(amountRequested) || amountRequested <= 0) {
        return NextResponse.json({ success: false, message: 'Montant invalide' }, { status: 400 });
      }
      amountToCharge = Math.round(amountRequested * DEPOSIT_RATE * 100) / 100;
      description = `FondsLink — Acompte 25% prêt ${applicationData.amount} ${currency}`;
    }

    // ── 2. Générer l'ID de commande ──
    const orderId = (isInsurance ? 'INS-' : 'FL-') + Date.now().toString(36).toUpperCase();

    // ── 3. URL de base depuis la variable d'environnement ──
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://fondslink.com';

    // ── 4. Créer le lien de paiement GeniusPay ──
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
        amount: amountToCharge,
        currency,
        description,
        customer: {
          name: `${applicationData.firstName} ${applicationData.lastName}`.trim(),
          email: applicationData.email,
          phone: applicationData.phone,
        },
        success_url: `${BASE_URL}/${lang}/${isInsurance ? 'assurance-confirmee' : 'paiement-confirme'}?ref=${orderId}`,
        error_url: `${BASE_URL}/${lang}/${isInsurance ? 'assurance-echoue' : 'paiement-echoue'}?ref=${orderId}`,
        metadata: {
          order_id: orderId,
          order_reference: orderId,
          gp_reference: orderId,
          source: 'fondslink',
          type: isInsurance ? 'insurance_deposit' : 'loan_deposit',
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

    // ── 5. Appeler l'API Brevo pour générer le PDF et envoyer les emails ──
    const brevoUrl = `${BASE_URL}/api/brevo`;
    
    try {
      const brevoRes = await fetch(brevoUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationData,
          lang,
          type,
          depositAmount: amountToCharge,
          currency,
          orderId,
          paymentUrl,
        }),
      });

      if (!brevoRes.ok) {
        console.error('❌ Brevo API error:', await brevoRes.text());
      }

      const brevoData = await brevoRes.json().catch(() => ({}));
      
      // ── 6. Retourner la réponse ──
      return NextResponse.json({
        success: true,
        orderId,
        paymentUrl,
        depositAmount: amountToCharge,
        currency,
        contractUrl: brevoData.contractUrl || '',
        type,
      });
    } catch (brevoError) {
      // Si Brevo échoue, on retourne quand même le lien de paiement
      console.error('⚠️ Brevo service error (non-blocking):', brevoError);
      return NextResponse.json({
        success: true,
        orderId,
        paymentUrl,
        depositAmount: amountToCharge,
        currency,
        contractUrl: '',
        type,
        warning: 'Email non envoyé, mais le lien de paiement est disponible',
      });
    }
  } catch (error) {
    console.error('❌ create-payment-link error:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
