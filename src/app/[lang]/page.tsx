
// src/app/[lang]/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { getTranslations, Locale } from '@/lib/i18n';
import LoanModal from '@/components/LoanModal';

// Icônes SVG réutilisables
const Icons = {
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Clock: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  FileText: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Users: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  CreditCard: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
      <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
  ),
  Phone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  Mail: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Star: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
};

export default function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counters, setCounters] = useState({ clients: 0, loans: 0, satisfaction: 0 });
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  
  const lang = (params as any).lang as Locale;
  const t = getTranslations(lang);

  // Animation des compteurs
  useEffect(() => {
    if (isStatsInView) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        setCounters({
          clients: Math.min(Math.floor((step / steps) * 15000), 15000),
          loans: Math.min(Math.floor((step / steps) * 98), 98),
          satisfaction: Math.min(Math.floor((step / steps) * 25), 25)
        });
        
        if (step >= steps) clearInterval(timer);
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isStatsInView]);

  // Témoignages en rotation automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: lang === 'nl' ? "Uitstekende service! Mijn lening werd in minder dan 24 uur goedgekeurd. Het proces was eenvoudig en het team zeer professioneel." : 
            lang === 'en' ? "Excellent service! My loan was approved in less than 24 hours. The process was simple and the team very professional." :
            "¡Servicio excelente! Mi préstamo fue aprobado en menos de 24 horas. El proceso fue simple y el equipo muy profesional.",
      name: lang === 'nl' ? 'Tevreden klant' : lang === 'en' ? 'Satisfied customer' : 'Cliente satisfecho',
      role: lang === 'nl' ? 'Ondernemer' : lang === 'en' ? 'Entrepreneur' : 'Emprendedor'
    },
    {
      text: lang === 'nl' ? "Een snelle en efficiënte financieringsoplossing. Ik beveel het ten zeerste aan bij alle ondernemers." :
            lang === 'en' ? "A fast and efficient financing solution. I highly recommend it to all entrepreneurs." :
            "Una solución de financiación rápida y eficiente. Lo recomiendo encarecidamente a todos los emprendedores.",
      name: lang === 'nl' ? 'Tevreden klant' : lang === 'en' ? 'Satisfied customer' : 'Cliente satisfecho',
      role: lang === 'nl' ? 'ZZP\'er' : lang === 'en' ? 'Freelancer' : 'Freelance'
    },
    {
      text: lang === 'nl' ? "Team dat luistert en zeer responsief is. Het proces is transparant en de voorwaarden zijn duidelijk." :
            lang === 'en' ? "A team that listens and is very responsive. The process is transparent and the conditions are clear." :
            "Un equipo que escucha y es muy receptivo. El proceso es transparente y las condiciones son claras.",
      name: lang === 'nl' ? 'Tevreden klant' : lang === 'en' ? 'Satisfied customer' : 'Cliente satisfecho',
      role: lang === 'nl' ? 'Directeur MKB' : lang === 'en' ? 'SME Director' : 'Director PYME'
    }
  ];

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
        {/* Fond géométrique subtil */}
        <div className="absolute inset-0 z-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-gray-900/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full py-20">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-full mb-8"
              >
                <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                <span className="text-gray-700 text-sm font-medium">
                  {lang === 'nl' ? 'Snelle financiering binnen 24u' : 
                   lang === 'en' ? 'Fast financing within 24h' : 
                   'Financiación rápida en 24h'}
                </span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-gray-900">
                {t.hero.title}
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-600 mb-10 leading-relaxed"
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className="group px-8 py-4 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#C4A02E] transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  {t.hero.cta}
                  <span className="group-hover:translate-x-1 transition-transform">
                    <Icons.ArrowRight />
                  </span>
                </motion.button>
                
                <Link href={`/${lang}/contact`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-[#D4AF37] transition-all flex items-center gap-2"
                  >
                    <Icons.Phone />
                    {lang === 'nl' ? 'Contact opnemen' : lang === 'en' ? 'Contact us' : 'Contactar'}
                  </motion.button>
                </Link>
              </motion.div>
              
              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-12 flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <Icons.Users />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">+15.000</div>
                    <div className="text-sm text-gray-600">
                      {lang === 'nl' ? 'tevreden klanten' : lang === 'en' ? 'satisfied customers' : 'clientes satisfechos'}
                    </div>
                  </div>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div className="flex items-center gap-2">
                  <Icons.Star />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-600">
                      {lang === 'nl' ? 'klantbeoordeling' : lang === 'en' ? 'customer rating' : 'valoración clientes'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Image Héro avec animations */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <Image
                    src="/images/hero-signing.jpg"
                    alt="Professionele financiering"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                  
                  {/* Badge flottant */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <Icons.Shield />
                      <div>
                        <div className="text-[#D4AF37] font-bold text-lg">98%</div>
                        <div className="text-gray-600 text-xs">
                          {lang === 'nl' ? 'Goedgekeurd' : lang === 'en' ? 'Approved' : 'Aprobado'}
                        </div>
                      </div>
                    </div>
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
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-3 bg-[#D4AF37] rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* STATS SECTION avec compteurs animés */}
      <section ref={statsRef} className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { value: counters.clients, suffix: '+', label: lang === 'nl' ? 'Tevreden klanten' : lang === 'en' ? 'Satisfied customers' : 'Clientes satisfechos', icon: <Icons.Users /> },
              { value: counters.loans, suffix: '%', label: lang === 'nl' ? 'Goedkeuringspercentage' : lang === 'en' ? 'Approval rate' : 'Tasa de aprobación', icon: <Icons.Check /> },
              { value: counters.satisfaction, suffix: '+', label: lang === 'nl' ? 'Jaar ervaring' : lang === 'en' ? 'Years of experience' : 'Años de experiencia', icon: <Icons.Clock /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-xl mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold text-white mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES - Design épuré */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">{t.benefits.title}</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {lang === 'nl' ? 'Ontdek waarom duizenden klanten voor onze financieringsoplossingen kiezen' :
               lang === 'en' ? 'Discover why thousands of customers choose our financing solutions' :
               'Descubra por qué miles de clientes eligen nuestras soluciones de financiación'}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.benefits.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white p-8 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gray-50 group-hover:bg-[#D4AF37]/10 rounded-lg flex items-center justify-center mb-6 transition-colors">
                  <div className="text-[#D4AF37]">
                    {[<Icons.Clock key="clock" />, <Icons.FileText key="file" />, <Icons.Check key="check" />, 
                      <Icons.Shield key="shield" />, <Icons.CreditCard key="card" />, <Icons.Users key="users" />][i]}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item}</h3>
                <p className="text-gray-600 text-sm">
                  {lang === 'nl' ? 'Professionele service met gegarandeerde kwaliteit en veiligheid.' :
                   lang === 'en' ? 'Professional service with guaranteed quality and security.' :
                   'Servicio profesional con calidad y seguridad garantizadas.'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE - Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">{t.steps.title}</h2>
            <p className="text-gray-600 text-lg">
              {lang === 'nl' ? 'Een eenvoudig proces in 4 stappen' :
               lang === 'en' ? 'A simple process in 4 steps' :
               'Un proceso simple en 4 pasos'}
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Ligne de progression pour desktop */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200">
              <motion.div 
                className="h-full bg-[#D4AF37]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[t.steps.s1, t.steps.s2, t.steps.s3, t.steps.s4].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-24 h-24 bg-white border-2 border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 shadow-lg"
                  >
                    <span className="text-2xl font-bold text-[#D4AF37]">{i + 1}</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step}</h3>
                  <p className="text-gray-600 text-sm">
                    {[
                      lang === 'nl' ? 'Vul het online formulier in enkele minuten in' :
                      lang === 'en' ? 'Fill out the online form in minutes' :
                      'Complete el formulario en línea en minutos',
                      lang === 'nl' ? 'Ontvang en onderteken digitaal uw contract' :
                      lang === 'en' ? 'Receive and digitally sign your contract' :
                      'Reciba y firme digitalmente su contrato',
                      lang === 'nl' ? 'Veilige online betaling van administratiekosten' :
                      lang === 'en' ? 'Secure online payment of administrative fees' :
                      'Pago seguro en línea de tasas administrativas',
                      lang === 'nl' ? 'Uw dossier wordt automatisch gevalideerd' :
                      lang === 'en' ? 'Your file is automatically validated' :
                      'Su expediente se valida automáticamente'
                    ][i]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES - Carousel élégant */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {lang === 'nl' ? 'Wat onze klanten zeggen' : lang === 'en' ? 'What our customers say' : 'Lo que dicen nuestros clientes'}
            </h2>
          </motion.div>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-gray-50 p-10 md:p-14 rounded-2xl border border-gray-100"
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#D4AF37]">
                      <Icons.Star />
                    </span>
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-8 leading-relaxed">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Icons.Users />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</div>
                    <div className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeTestimonial === i ? 'bg-[#D4AF37] w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                  }`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {lang === 'nl' ? 'Klaar om uw project te realiseren?' :
               lang === 'en' ? 'Ready to make your project happen?' :
               '¿Listo para hacer realidad su proyecto?'}
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {lang === 'nl' ? 'Sluit u aan bij duizenden tevreden klanten die ons vertrouwen voor hun financiering' :
               lang === 'en' ? 'Join thousands of satisfied customers who trust us for their financing' :
               'Únase a miles de clientes satisfechos que confían en nosotros para su financiación'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#C4A02E] transition-colors shadow-xl flex items-center gap-2 mx-auto"
            >
              {lang === 'nl' ? 'Start mijn aanvraag' : lang === 'en' ? 'Start my application' : 'Iniciar mi solicitud'}
              <Icons.ArrowRight />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-12 text-center text-gray-900"
          >
            FAQ
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: t.faq.q1, a: t.faq.a1 },
              { q: t.faq.q2, a: t.faq.a2 },
              { 
                q: lang === 'nl' ? 'Kan ik vervroegd aflossen?' : 
                   lang === 'en' ? 'Can I repay early?' : 
                   '¿Puedo amortizar anticipadamente?',
                a: lang === 'nl' ? 'Ja, vervroegd aflossen is mogelijk zonder extra kosten. Wij moedigen financiële flexibiliteit aan.' :
                   lang === 'en' ? 'Yes, early repayment is possible without additional fees. We encourage financial flexibility.' :
                   'Sí, la amortización anticipada es posible sin costes adicionales. Fomentamos la flexibilidad financiera.'
              },
              { 
                q: lang === 'nl' ? 'Welke documenten heb ik nodig?' :
                   lang === 'en' ? 'What documents do I need?' :
                   '¿Qué documentos necesito?',
                a: lang === 'nl' ? 'U heeft een geldig identiteitsbewijs, recente loonstrook en bankafschrift nodig.' :
                   lang === 'en' ? 'You need a valid ID, recent pay stub and bank statement.' :
                   'Necesita un documento de identidad válido, nómina reciente y extracto bancario.'
              }
            ].map((faq, i) => (
              <motion.details
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-gray-50 p-6 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <summary className="font-semibold text-gray-900 list-none flex justify-between items-center gap-4">
                  {faq.q}
                  <span className="text-[#D4AF37] flex-shrink-0 group-open:rotate-180 transition-transform duration-300">
                    <Icons.ChevronDown />
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL DEMANDE DE PRÊT */}
      <LoanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} />
    </div>
  );
}
