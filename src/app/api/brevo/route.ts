// src/app/api/brevo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// Chargement dynamique pour éviter les erreurs de build Turbopack/TypeScript
// avec les modules natifs Node.js sur Vercel
const PDFDocument = require('pdfkit');

export async function POST(req: NextRequest) {
  try {
    const { applicationData, lang, email } = await req.json();
    
    // 1. Générer le PDF
    const pdfDoc = new PDFDocument();
    const chunks: Buffer[] = [];
    
    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    
    pdfDoc.fontSize(16).text('LOAN AGREEMENT - FONDSLINK', { align: 'center' });
    pdfDoc.moveDown();
    pdfDoc.fontSize(12).text(`Borrower: ${applicationData.firstName} ${applicationData.lastName}`);
    pdfDoc.text(`Amount: ${applicationData.amount} ${applicationData.currency}`);
    pdfDoc.text(`Duration: ${applicationData.duration} months`);
    pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`);
    pdfDoc.moveDown(2);
    pdfDoc.text('By signing electronically, the Borrower confirms that all information provided is complete and accurate.');
    pdfDoc.end();

    const pdfBuffer = Buffer.concat(chunks);
    const pdfBase64 = pdfBuffer.toString('base64');
    
    // 2. Stocker dans Firebase Storage
    const storageRef = ref(storage, `contracts/${applicationData.email}_${Date.now()}.pdf`);
    await uploadString(storageRef, pdfBase64, 'base64', { contentType: 'application/pdf' });
    const pdfUrl = await getDownloadURL(storageRef);

    // 3. Sauvegarder dans Firestore
    await setDoc(doc(collection(db, 'applications'), applicationData.email), {
      ...applicationData,
      contractUrl: pdfUrl,
      status: 'pending_payment',
      createdAt: new Date(),
      lang
    });

    // 4. Envoyer email via Brevo
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!
      },
      body: JSON.stringify({
        sender: { 
          name: 'FondsLink', 
          email: lang === 'nl' ? process.env.BREVO_CONTACT_EMAIL_NL : 
                 lang === 'en' ? process.env.BREVO_CONTACT_EMAIL_EN : 
                 process.env.BREVO_CONTACT_EMAIL_ES 
        },
        to: [{ email }],
        subject: lang === 'nl' ? 'Bevestiging van ontvangst' : 
                 lang === 'en' ? 'Application Received' : 'Solicitud recibida',
        htmlContent: `<h1>FondsLink</h1><p>${lang === 'nl' ? 'Uw aanvraag is ontvangen.' : 'Your application has been received.'}</p>`
      })
    });

    return NextResponse.json({ success: true, contractUrl: pdfUrl });
  } catch (error) {
    console.error('Brevo API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
