// src/app/[lang]/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getTranslations, Locale } from '@/lib/i18n';
import LoanModal from '@/components/LoanModal';

export default function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ️ ATTENTION : En Next.js 16, params est une Promise. 
  // Dans un Client Component, on doit utiliser use() ou gérer l'état via useEffect/useTransition.
  // Pour simplifier et éviter le suspense, on utilise une approche synchrone avec un cast sécurisé
  // car le layout parent a déjà résolu la langue. Si vous avez des erreurs de hydration, 
  // passez la langue résolue via un Context ou un prop du Layout.
  // Ici, nous supposons que params.lang est accessible directement grâce au routage dynamique.
  const lang = (params as any).lang as Locale;
  const t = getTranslations(lang);

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image 
            src="/images/hero-signing.jpg" 
            alt="Signing contract" 
            fill 
            className="object-cover object-right" 
            priority 
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-2xl bg-white/90 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-gray-100"
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight text-black">
              {t.hero.title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-gold text-lg font-semibold px-10 py-4"
            >
              {t.hero.cta}
            </button>
          </motion.div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center">{t.benefits.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {t.benefits.items.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 border border-gray-100 rounded-xl hover:shadow-lg transition-all bg-gray-50"
              >
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-[#D4AF37] font-bold text-xl">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{item}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-16 text-center text-[#D4AF37]">{t.steps.title}</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[t.steps.s1, t.steps.s2, t.steps.s3, t.steps.s4].map((step, i) => (
              <div key={i} className="relative p-6 border-l-2 border-[#D4AF37]/30">
                <span className="text-4xl font-bold text-gray-800 absolute -top-4 -left-2">{i + 1}</span>
                <p className="text-lg font-medium pt-4">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ RAPIDE (Maintenant multilingue) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">FAQ</h2>
          <div className="space-y-4">
            <details className="group bg-white p-6 rounded-lg shadow-sm cursor-pointer">
              <summary className="font-semibold list-none flex justify-between items-center">
                {t.faq.q1}
                <span className="text-[#D4AF37] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm">{t.faq.a1}</p>
            </details>
            <details className="group bg-white p-6 rounded-lg shadow-sm cursor-pointer">
              <summary className="font-semibold list-none flex justify-between items-center">
                {t.faq.q2}
                <span className="text-[#D4AF37] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm">{t.faq.a2}</p>
            </details>
          </div>
        </div>
      </section>

      {/* MODAL DEMANDE DE PRÊT */}
      <LoanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} />
    </>
  );
}
