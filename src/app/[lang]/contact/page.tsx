'use client';
import { useState } from 'react';
import { translations } from '@/lib/translations';

export default function ContactPage({ params }: { params: { lang: string } }) {
  const t = translations[params.lang as keyof typeof translations] || translations.nl;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await fetch('/api/brevo/contact', { // Créer cette route similaire à /brevo/route.ts
        method: 'POST',
        body: JSON.stringify({ ...data, lang: params.lang })
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
          <h2 className="text-2xl font-bold mb-4">Message envoyé</h2>
          <p className="text-gray-600">Nous vous répondrons dans les plus brefs délais.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-20 px-6">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center">{t.nav.contact}</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nom complet</label>
            <input name="name" required className="input-field" />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input name="email" type="email" required className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input name="phone" type="tel" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sujet</label>
            <select name="subject" className="input-field">
              <option value="info">Informations générales</option>
              <option value="support">Support technique</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <textarea name="message" rows={4} required className="input-field resize-none"></textarea>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="btn-primary w-full py-4 mt-4"
          >
            {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
          </button>
        </div>
      </form>
    </div>
  );
}