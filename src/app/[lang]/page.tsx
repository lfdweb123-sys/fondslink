
// src/app/[lang]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { getTranslations, Locale } from '@/lib/i18n';
import LoanModal from '@/components/LoanModal';

export default function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counters, setCounters] = useState({ clients: 0, loans: 0, experience: 0 });
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  
  const lang = (params as any).lang as Locale;
  const t = getTranslations(lang);

  // Animation des compteurs
  useEffect(() => {
    if (isStatsInView) {
      const duration = 2000;
      const steps = 50;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        setCounters({
          clients: Math.min(Math.floor((step / steps) * 15000), 15000),
          loans: Math.min(Math.floor((step / steps) * 50000000), 50000000),
          experience: Math.min(Math.floor((step / steps) * 25), 25)
        });
        
        if (step >= steps) clearInterval(timer);
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isStatsInView]);

  // Témoignages en rotation automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* HERO SECTION - Nouveau design premium */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Particules animées en arrière-plan */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#D4AF37] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="inline-block px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full mb-6"
              >
                <span className="text-[#D4AF37] text-sm font-medium">⚡ Financement rapide en 24h</span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">{t.hero.title.split(' ').slice(0, 2).join(' ')}</span>
                <br />
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
                  {t.hero.title.split(' ').slice(2).join(' ')}
                </span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed"
              >
                {t.hero.subtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold rounded-xl overflow-hidden shadow-2xl shadow-[#D4AF37]/30"
                >
                  <span className="relative z-10">{t.hero.cta}</span>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl backdrop-blur-sm hover:border-[#D4AF37] transition-colors"
                >
                  📞 Parler à un expert
                </motion.button>
              </motion.div>
              
              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 flex items-center gap-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gradient-to-br from-gray-400 to-gray-600" />
                  ))}
                </div>
                <div>
                  <div className="text-[#D4AF37] font-bold text-lg">+15,000 clients</div>
                  <div className="text-gray-400 text-sm">nous font confiance</div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Image Héro avec animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/20">
                  <Image
                    src="/images/hero-signing.jpg"
                    alt="Service financier premium"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badge flottant */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-8 right-8 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                  >
                    <div className="text-[#D4AF37] font-bold text-2xl">98%</div>
                    <div className="text-white text-sm">Taux de satisfaction</div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION avec compteurs animés */}
      <section ref={statsRef} className="py-16 bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { value: counters.clients, label: 'Clients satisfaits', suffix: '+', icon: '👥' },
              { value: `${(counters.loans / 1000000).toFixed(1)}`, label: 'Millions financés', suffix: 'M€', icon: '💰' },
              { value: counters.experience, label: "Années d'expérience", suffix: '+', icon: '🎯' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-5xl font-bold text-white mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES - Design amélioré avec animations au scroll */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t.benefits.title}</h2>
            <p className="text-gray-600 text-lg">Pourquoi choisir notre service de financement</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {t.benefits.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl flex items-center justify-center mb-6 text-2xl"
                >
                  {['🚀', '💎', '🛡️', '⚡', '💡', '🎯'][i]}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#D4AF37] transition-colors">
                  {item}
                </h3>
                <p className="text-gray-600">
                  {i === 0 ? 'Obtenez votre financement en un temps record grâce à notre processus optimisé.' :
                   i === 1 ? 'Des conditions avantageuses et transparentes adaptées à votre situation.' :
                   'Vos données sont protégées avec les plus hauts standards de sécurité.'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS - Timeline animée */}
      <section className="py-24 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">{t.steps.title}</h2>
            <p className="text-gray-400">Un processus simple et transparent en 4 étapes</p>
          </motion.div>
          
          <div className="relative">
            {/* Ligne de progression */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0" />
            
            <div className="grid md:grid-cols-4 gap-8">
              {[t.steps.s1, t.steps.s2, t.steps.s3, t.steps.s4].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <div className="text-center">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black shadow-lg shadow-[#D4AF37]/30"
                    >
                      {i + 1}
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-3">{step}</h3>
                    <p className="text-gray-400">
                      {i === 0 ? 'Remplissez le formulaire en quelques clics' :
                       i === 1 ? 'Nous étudions votre dossier rapidement' :
                       i === 2 ? 'Recevez une proposition adaptée' :
                       'Les fonds sont disponibles sur votre compte'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES - Carousel */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Ce que disent nos clients
          </motion.h2>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-2xl"
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>
                <p className="text-xl text-gray-700 mb-6">
                  {[
                    "Service exceptionnel ! J'ai obtenu mon prêt en moins de 24h. Processus simple et équipe très professionnelle.",
                    "Une solution de financement rapide et efficace. Je recommande vivement à tous les entrepreneurs.",
                    "Équipe à l'écoute et très réactive. Le processus est transparent et les conditions sont claires."
                  ][activeTestimonial]}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full" />
                  <div>
                    <div className="font-bold">Client satisfait</div>
                    <div className="text-gray-500 text-sm">Entrepreneur</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === i ? 'bg-[#D4AF37] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Design premium */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] opacity-90" />
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Prêt à concrétiser vos projets ?
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Rejoignez les milliers de clients qui nous font confiance pour leur financement
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-black text-[#D4AF37] font-bold rounded-xl hover:bg-gray-900 transition-colors shadow-2xl"
            >
              Démarrer ma demande maintenant →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-8"
          >
            <p className="text-gray-500 uppercase text-sm tracking-wider">Ils nous font confiance</p>
          </motion.div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50">
            {['BNP Paribas', 'AXA', 'Allianz', 'Crédit Mutuel', 'Groupama'].map((partner, i) => (
              <motion.div
                key={i}
                whileHover={{ opacity: 1, scale: 1.1 }}
                className="text-2xl font-bold text-gray-400"
              >
                {partner}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ RAPIDE */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Questions fréquentes
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: t.faq.q1, a: t.faq.a1 },
              { q: t.faq.q2, a: t.faq.a2 },
              { q: "Quels sont les taux d'intérêt ?", a: "Nos taux sont compétitifs et personnalisés selon votre profil. Contactez-nous pour une simulation gratuite." },
              { q: "Puis-je rembourser par anticipation ?", a: "Oui, le remboursement anticipé est possible sans pénalités. Nous encourageons la flexibilité financière." }
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-gray-50 p-6 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <summary className="font-semibold text-lg list-none flex justify-between items-center">
                  {faq.q}
                  <motion.span
                    className="text-[#D4AF37] text-2xl"
                    whileTap={{ rotate: 180 }}
                  >
                    +
                  </motion.span>
                </summary>
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 text-gray-600"
                >
                  {faq.a}
                </motion.p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-4">Une question ? Contactez-nous</h3>
            <p className="text-gray-400 mb-8">Notre équipe est disponible 24/7 pour vous accompagner</p>
            <div className="flex justify-center gap-8">
              <motion.a
                href="tel:+33123456789"
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 text-[#D4AF37]"
              >
                📞 01 23 45 67 89
              </motion.a>
              <motion.a
                href="mailto:contact@financement.fr"
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2 text-[#D4AF37]"
              >
                ✉️ contact@financement.fr
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MODAL DEMANDE DE PRÊT */}
      <LoanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} />
    </>
  );
}
