import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-geniuspay-signature');
  const body = await req.text();
  
  // Vérification du secret webhook (à implémenter selon doc GeniusPay)
  // if (!verifyWebhook(body, signature)) return NextResponse.json({ error: 'Invalid' }, { status: 401 });

  const payload = JSON.parse(body);
  
  if (payload.status === 'completed') {
    const q = query(collection(db, 'applications'), where('paymentId', '==', payload.paymentId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const appDoc = snapshot.docs[0];
      await updateDoc(doc(db, 'applications', appDoc.id), {
        status: 'validated',
        paidAt: new Date(),
        adminFeePaid: true
      });
      
      // Déclencher email de validation ici via Brevo
    }
  }
  
  return NextResponse.json({ received: true });
}