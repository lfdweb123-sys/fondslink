// src/components/LoanModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignaturePad from './SignaturePad';
import { getTranslations, type Locale } from '@/lib/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

// Sélecteur de date personnalisé professionnel
function DatePicker({ label, value, onChange, lang }: { label: string; value: string; onChange: (val: string) => void; lang: string }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const months = lang === 'nl' 
    ? ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
    : lang === 'en'
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const daysInMonth = month ? new Date(parseInt(year) || 2000, parseInt(month), 0).getDate() : 31;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleDaySelect = (d: number) => {
    const dd = d.toString().padStart(2, '0');
    setDay(dd);
    if (month && year) {
      onChange(`${year}-${month.padStart(2, '0')}-${dd}`);
      setIsOpen(false);
    }
  };

  const handleMonthSelect = (m: string, i: number) => {
    const mm = (i + 1).toString().padStart(2, '0');
    setMonth(mm);
    if (day && year) {
      onChange(`${year}-${mm}-${day}`);
    }
  };

  const handleYearSelect = (y: number) => {
    const yy = y.toString();
    setYear(yy);
    if (day && month) {
      onChange(`${yy}-${month}-${day}`);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field text-left flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value ? new Date(value).toLocaleDateString(lang === 'nl' ? 'nl-NL' : lang === 'en' ? 'en-US' : 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : label}
        </span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-full min-w-[300px]">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <select
              value={day || ''}
              onChange={(e) => handleDaySelect(parseInt(e.target.value))}
              className="input-field text-sm"
            >
              <option value="">{lang === 'nl' ? 'Dag' : lang === 'en' ? 'Day' : 'Día'}</option>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={month || ''}
              onChange={(e) => handleMonthSelect(e.target.value, parseInt(e.target.value) - 1)}
              className="input-field text-sm"
            >
              <option value="">{lang === 'nl' ? 'Maand' : lang === 'en' ? 'Month' : 'Mes'}</option>
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={year || ''}
              onChange={(e) => handleYearSelect(parseInt(e.target.value))}
              className="input-field text-sm"
            >
              <option value="">{lang === 'nl' ? 'Jaar' : lang === 'en' ? 'Year' : 'Año'}</option>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            {lang === 'nl' ? 'Sluiten' : lang === 'en' ? 'Close' : 'Cerrar'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoanModal({ isOpen, onClose, lang }: Props) {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState<string>('');
  const [birthDate, setBirthDate] = useState('');
  const t = getTranslations(lang as Locale);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [t.form.personal, t.form.financial, t.form.bank, t.form.docs, t.form.contract, t.form.payment];
  const lm = t.loanModal;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative">
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{lm.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{lm.step} {step} {lm.of} {steps.length} : {steps[step-1]}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" aria-label={lm.close}>×</button>
            </div>
            <div className="w-full h-1 bg-gray-100">
              <motion.div className="h-full bg-[#D4AF37]" initial={{ width: 0 }} animate={{ width: `${(step / steps.length) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.lastName} *</label>
                        <input type="text" placeholder={lm.step1.lastName} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.firstName} *</label>
                        <input type="text" placeholder={lm.step1.firstName} className="input-field" required />
                      </div>
                      <div>
                        <DatePicker label={lm.step1.birthDate} value={birthDate} onChange={setBirthDate} lang={lang} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.nationality} *</label>
                        <input type="text" placeholder={lm.step1.nationality} className="input-field" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.address} *</label>
                        <input type="text" placeholder={lm.step1.address} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.city} *</label>
                        <input type="text" placeholder={lm.step1.city} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.postalCode} *</label>
                        <input type="text" placeholder={lm.step1.postalCode} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.country} *</label>
                        <input type="text" placeholder={lm.step1.country} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.phone} *</label>
                        <input type="tel" placeholder={lm.step1.phone} className="input-field" required />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step1.email} *</label>
                        <input type="email" placeholder={lm.step1.email} className="input-field" required />
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.amountRequested} *</label>
                        <div className="flex gap-2">
                          <input type="number" className="input-field flex-1" placeholder="0" min="0" required />
                          <select className="input-field w-24">
                            <option>EUR</option>
                            <option>USD</option>
                            <option>GBP</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.duration} *</label>
                        <input type="number" placeholder="12" className="input-field" min="1" max="360" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.monthlyIncome} *</label>
                        <input type="number" placeholder="0" className="input-field" min="0" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.profession} *</label>
                        <input type="text" placeholder={lm.step2.profession} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.employer}</label>
                        <input type="text" placeholder={lm.step2.employer} className="input-field" />
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step3.bankName} *</label>
                        <input type="text" placeholder={lm.step3.bankName} className="input-field" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step3.iban} *</label>
                        <input type="text" placeholder={lm.step3.iban} className="input-field uppercase" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step3.bic} *</label>
                        <input type="text" placeholder={lm.step3.bic} className="input-field uppercase" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step3.accountHolder} *</label>
                        <input type="text" placeholder={lm.step3.accountHolder} className="input-field" required />
                      </div>
                    </div>
                  )}
                  {step === 4 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      {[{ t: lm.step4.idDocument, s: `PDF, JPG (${lm.step4.maxSize})` }, { t: lm.step4.proofOfAddress, s: lm.step4.lessThan3Months }, { t: lm.step4.payslip, s: lm.step4.last3Months }].map((f, i) => (
                        <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-gray-50 hover:bg-white">
                          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {i === 0 ? <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></> : i === 1 ? <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></> : <><rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect><line x1="6" y1="9" x2="18" y2="9"></line><line x1="6" y1="13" x2="18" y2="13"></line><line x1="6" y1="17" x2="12" y2="17"></line></>}
                            </svg>
                          </div>
                          <p className="font-medium text-gray-900">{f.t} *</p>
                          <p className="text-xs text-gray-500 mt-2">{f.s}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg text-sm leading-relaxed h-64 overflow-y-auto border border-gray-200">
                        <h3 className="font-bold mb-4 text-center text-gray-900">{lm.step5.contractTitle}</h3>
                        {lm.step5.sections.map((s, i) => <p key={i} className="mb-4 text-gray-700">{s}</p>)}
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input type="checkbox" className="mt-1 w-5 h-5 accent-[#D4AF37]" />
                        <span className="text-sm text-gray-700">{lm.step5.acceptTerms}</span>
                      </label>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">{lm.step5.yourSignature}</label>
                        <SignaturePad onSign={(data) => setSignature(data)} lang={lang} />
                      </div>
                    </div>
                  )}
                  {step === 6 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{lm.step6.finalizingTitle}</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">{lm.step6.finalizingDesc}</p>
                      <div id="geniuspay-container" className="max-w-md mx-auto" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-between rounded-b-2xl">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} className="px-6 py-3 text-gray-500 hover:text-black disabled:opacity-30 transition-colors font-medium">← {lm.previous}</button>
              {step < 6 ? (
                <button onClick={() => setStep(s => Math.min(6, s + 1))} className="btn-primary">{lm.continue} →</button>
              ) : (
                <button disabled className="btn-primary opacity-50 cursor-not-allowed">{lm.paymentWaiting}</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
