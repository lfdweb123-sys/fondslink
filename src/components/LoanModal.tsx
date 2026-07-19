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

export default function LoanModal({ isOpen, onClose, lang }: Props) {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState<string>('');
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
                      {[{ l: lm.step1.lastName }, { l: lm.step1.firstName }, { l: lm.step1.birthDate, t: 'date' }, { l: lm.step1.nationality }, { l: lm.step1.address, col: true }, { l: lm.step1.city }, { l: lm.step1.postalCode }, { l: lm.step1.country }, { l: lm.step1.phone, t: 'tel' }, { l: lm.step1.email, t: 'email', col: true }].map((f, i) => (
                        <div key={i} className={f.col ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{f.l} *</label>
                          <input type={f.t || 'text'} placeholder={f.l} className="input-field" required />
                        </div>
                      ))}
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.amountRequested} *</label><div className="flex gap-2"><input type="number" className="input-field flex-1" placeholder="0" min="0" required /><select className="input-field w-24"><option>EUR</option><option>USD</option><option>GBP</option></select></div></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.duration} *</label><input type="number" placeholder="12" className="input-field" min="1" max="360" required /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.monthlyIncome} *</label><input type="number" placeholder="0" className="input-field" min="0" required /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.profession} *</label><input placeholder={lm.step2.profession} className="input-field" required /></div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.employer}</label><input placeholder={lm.step2.employer} className="input-field" /></div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      {[lm.step3.bankName, lm.step3.iban, lm.step3.bic, lm.step3.accountHolder].map((f, i) => (
                        <div key={i}><label className="block text-sm font-medium text-gray-700 mb-2">{f} *</label><input placeholder={f} className={`input-field ${i === 1 || i === 2 ? 'uppercase' : ''}`} required /></div>
                      ))}
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
                      <div><label className="block text-sm font-medium text-gray-700 mb-3">{lm.step5.yourSignature}</label><SignaturePad onSign={(data) => setSignature(data)} lang={lang} /></div>
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
