// src/app/[lang]/contact/page.tsx
'use client';
import { useState, use } from 'react';
import { motion } from 'framer-motion';
import { getTranslations, type Locale } from '@/lib/i18n';

const Icons = {
  Phone: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ),
  Mail: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  MapPin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  ),
  Check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  User: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
};

export default function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const t = getTranslations(lang as Locale);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const formDataToSend = new FormData(e.currentTarget);
    const data = Object.fromEntries(formDataToSend.entries());
    try {
      await fetch('/api/brevo/contact', { method: 'POST', body: JSON.stringify({ ...data, lang }) });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const contactItems = [
    { icon: <Icons.Phone />, title: t.contact.phoneLabel, value: t.contact.phoneValue, href: 'tel:+31201234567' },
    { icon: <Icons.Mail />, title: t.contact.emailLabel, value: t.contact.emailValue, href: `mailto:${t.contact.emailValue}` },
    { icon: <Icons.MapPin />, title: t.contact.addressLabel, value: t.contact.addressValue, href: '#' },
    { icon: <Icons.Clock />, title: t.contact.availabilityLabel, value: t.contact.availabilityValue, href: '#' },
  ];

  if (status === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-white p-12 rounded-2xl shadow-2xl border border-gray-100 text-center max-w-md w-full">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-green-500"><Icons.Check /></div>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.contact.sentTitle}</h2>
          <p className="text-gray-600 mb-8">{t.contact.sentDesc}</p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="text-[#D4AF37] font-semibold hover:text-[#C4A02E] transition-colors">
            {t.contact.newMessage}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="lg:col-span-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{t.nav.contact}</h1>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">{t.contact.subtitle}</p>
            <div className="space-y-8">
              {contactItems.map((item, i) => (
                <motion.a key={i} href={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }} whileHover={{ x: 5 }} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <div className="text-[#D4AF37]">{item.icon}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">{item.title}</div>
                    <div className="text-gray-900 font-semibold group-hover:text-[#D4AF37] transition-colors">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.name}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.User /></div>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-gray-900" placeholder={t.contact.name} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.email}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Mail /></div>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-gray-900" placeholder={t.contact.email} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.phone}</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Phone /></div>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-gray-900" placeholder={t.contact.phone} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.subject}</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all text-gray-900 cursor-pointer">
                    <option value="">{t.contact.selectSubject}</option>
                    <option value="info">{t.contact.subjectOptions.info}</option>
                    <option value="support">{t.contact.subjectOptions.support}</option>
                    <option value="loan">{t.contact.subjectOptions.loan}</option>
                    <option value="other">{t.contact.subjectOptions.other}</option>
                  </select>
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.contact.message}</label>
                <textarea name="message" rows={5} required value={formData.message} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none text-gray-900" placeholder={t.contact.message}></textarea>
              </div>
              <motion.button type="submit" disabled={status === 'loading'} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-4 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#C4A02E] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {status === 'loading' ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />{t.contact.sending}</>
                ) : (
                  <>{t.contact.send}<Icons.Send /></>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
