// src/app/api/geniuspay-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const event = (body.event || body.status || '').toLowerCase();
  const data = body.data || body;

  const reference = data?.reference || data?.metadata?.order_reference || data?.metadata?.order_id;

  const paidEvents = ['payment.success', 'payment.completed', 'completed', 'success', 'paid'];
  const failedEvents = ['payment.failed', 'payment.cancelled', 'payment.expired', 'failed', 'cancelled', 'expired'];

  if (!reference) {
    return NextResponse.json({ received: true, note: 'no reference' });
  }

  try {
    const q = query(collection(db, 'applications'), where('gpReference', '==', reference));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ received: true, note: 'application not found' });
    }

    const appDoc = snapshot.docs[0];

    if (paidEvents.includes(event)) {
      await updateDoc(doc(db, 'applications', appDoc.id), {
        status: 'deposit_paid',
        paymentStatus: 'paid',
        paidAt: new Date(),
        updatedAt: new Date(),
      });

      // Email de confirmation au client
      const appData = appDoc.data();
      if (appData.email) {
        await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': process.env.BREVO_API_KEY! },
          body: JSON.stringify({
            sender: { name: 'FondsLink', email: process.env.SHOP_EMAIL || 'noreply@fondslink.com' },
            to: [{ email: appData.email }],
            subject: `Acompte confirmé — ${appData.orderId}`,
            htmlContent: `<h2>Paiement confirmé</h2><p>Votre acompte pour le dossier ${appData.orderId} a bien été reçu. Votre dossier est en cours de validation.</p>`,
          }),
        });
      }
    } else if (failedEvents.includes(event)) {
      await updateDoc(doc(db, 'applications', appDoc.id), {
        status: 'payment_failed',
        paymentStatus: 'failed',
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ received: true, updated: appDoc.id });
  } catch (err) {
    console.error('🔥 Webhook error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
