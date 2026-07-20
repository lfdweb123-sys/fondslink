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
function DatePicker({ label, value, onChange, lang, error, errorText }: { label: string; value: string; onChange: (val: string) => void; lang: string; error?: boolean; errorText?: string }) {
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
        className={`input-field text-left flex items-center justify-between ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
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
      {error && <p className="text-red-500 text-xs mt-1">{errorText}</p>}

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

// Champ texte contrôlé avec affichage d'erreur
function Field({
  label, value, onChange, error, type = 'text', placeholder, className = '', min, max, errorText,
}: {
  label: string; value: string; onChange: (v: string) => void; error?: boolean;
  type?: string; placeholder?: string; className?: string; min?: string; max?: string; errorText?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`input-field ${className} ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{errorText}</p>}
    </div>
  );
}

export default function LoanModal({ isOpen, onClose, lang }: Props) {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const t = getTranslations(lang as Locale);

  // Step 1
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nationality, setNationality] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Step 2
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [duration, setDuration] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [profession, setProfession] = useState('');
  const [employer, setEmployer] = useState('');

  // Step 3
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [bic, setBic] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  // Step 4
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [payslip, setPayslip] = useState<File | null>(null);

  // Step 5
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Step 6 — génération du lien de paiement
  const [paymentUrl, setPaymentUrl] = useState('');
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'bank'>('online');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod('online');
    }
  }, [isOpen]);

  const submitApplication = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const applicationData = {
        lastName, firstName, birthDate, nationality, address, city, postalCode, country, phone, email,
        amount, currency, duration, monthlyIncome, profession, employer,
        bankName, iban, bic, accountHolder,
        signature,
        paymentMethod,
      };

      const res = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationData, lang }),
      });

      const data = await res.json();

      if (!data.success) {
        setSubmitError(data.message || lm.step6.errorGeneric);
        setSubmitting(false);
        return;
      }

      setPaymentUrl(data.paymentUrl);
      setDepositAmount(data.depositAmount);
    } catch (e) {
      setSubmitError(lm.step6.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 6 && !paymentUrl && !submitting) {
      submitApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!isOpen) return null;

  const steps = [t.form.personal, t.form.financial, t.form.bank, t.form.docs, t.form.contract, t.form.payment];
  const lm = t.loanModal;

  // Validation par étape : renvoie la liste des champs en erreur
  const validateStep = (): Record<string, boolean> => {
    const e: Record<string, boolean> = {};
    if (step === 1) {
      if (!lastName.trim()) e.lastName = true;
      if (!firstName.trim()) e.firstName = true;
      if (!birthDate.trim()) e.birthDate = true;
      if (!nationality.trim()) e.nationality = true;
      if (!address.trim()) e.address = true;
      if (!city.trim()) e.city = true;
      if (!postalCode.trim()) e.postalCode = true;
      if (!country.trim()) e.country = true;
      if (!phone.trim()) e.phone = true;
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = true;
    }
    if (step === 2) {
      if (!amount || Number(amount) <= 0) e.amount = true;
      if (!duration || Number(duration) <= 0) e.duration = true;
      if (!monthlyIncome || Number(monthlyIncome) < 0) e.monthlyIncome = true;
      if (!profession.trim()) e.profession = true;
    }
    if (step === 3) {
      if (!bankName.trim()) e.bankName = true;
      if (!iban.trim()) e.iban = true;
      if (!bic.trim()) e.bic = true;
      if (!accountHolder.trim()) e.accountHolder = true;
    }
    if (step === 4) {
      if (!idDocument) e.idDocument = true;
      if (!proofOfAddress) e.proofOfAddress = true;
      if (!payslip) e.payslip = true;
    }
    if (step === 5) {
      if (!acceptTerms) e.acceptTerms = true;
      if (!signature) e.signature = true;
    }
    return e;
  };

  const handleNext = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep(s => Math.min(6, s + 1));
  };

  const handlePrev = () => {
    setErrors({});
    setStep(s => Math.max(1, s - 1));
  };

  const handleFileChange = (setter: (f: File | null) => void, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setter(file);
    if (file) setErrors(prev => ({ ...prev, [field]: false }));
  };

  // Fonction pour copier les coordonnées bancaires
  const copyBankDetails = () => {
    const bankInfo = `Bridge Building Sp. Z.o.o.\nBanking Circle S.A.\nIBAN: LU034080000029652683\nBIC: BCIRLULL`;
    navigator.clipboard.writeText(bankInfo);
  };

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
                      <Field label={lm.step1.lastName} value={lastName} onChange={(v) => { setLastName(v); setErrors(p => ({ ...p, lastName: false })); }} placeholder={lm.step1.lastName} error={errors.lastName} errorText={lm.requiredField} />
                      <Field label={lm.step1.firstName} value={firstName} onChange={(v) => { setFirstName(v); setErrors(p => ({ ...p, firstName: false })); }} placeholder={lm.step1.firstName} error={errors.firstName} errorText={lm.requiredField} />
                      <div>
                        <DatePicker label={lm.step1.birthDate} value={birthDate} onChange={(v) => { setBirthDate(v); setErrors(p => ({ ...p, birthDate: false })); }} lang={lang} error={errors.birthDate} errorText={lm.requiredField} />
                      </div>
                      <Field label={lm.step1.nationality} value={nationality} onChange={(v) => { setNationality(v); setErrors(p => ({ ...p, nationality: false })); }} placeholder={lm.step1.nationality} error={errors.nationality} errorText={lm.requiredField} />
                      <div className="md:col-span-2">
                        <Field label={lm.step1.address} value={address} onChange={(v) => { setAddress(v); setErrors(p => ({ ...p, address: false })); }} placeholder={lm.step1.address} error={errors.address} errorText={lm.requiredField} />
                      </div>
                      <Field label={lm.step1.city} value={city} onChange={(v) => { setCity(v); setErrors(p => ({ ...p, city: false })); }} placeholder={lm.step1.city} error={errors.city} errorText={lm.requiredField} />
                      <Field label={lm.step1.postalCode} value={postalCode} onChange={(v) => { setPostalCode(v); setErrors(p => ({ ...p, postalCode: false })); }} placeholder={lm.step1.postalCode} error={errors.postalCode} errorText={lm.requiredField} />
                      <Field label={lm.step1.country} value={country} onChange={(v) => { setCountry(v); setErrors(p => ({ ...p, country: false })); }} placeholder={lm.step1.country} error={errors.country} errorText={lm.requiredField} />
                      <Field label={lm.step1.phone} value={phone} onChange={(v) => { setPhone(v); setErrors(p => ({ ...p, phone: false })); }} type="tel" placeholder={lm.step1.phone} error={errors.phone} errorText={lm.requiredField} />
                      <div className="md:col-span-2">
                        <Field label={lm.step1.email} value={email} onChange={(v) => { setEmail(v); setErrors(p => ({ ...p, email: false })); }} type="email" placeholder={lm.step1.email} error={errors.email} errorText={lm.requiredField} />
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.amountRequested} *</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: false })); }}
                            className={`input-field flex-1 ${errors.amount ? 'border-red-500 focus:ring-red-500' : ''}`}
                            placeholder="0"
                            min="0"
                          />
                          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input-field w-24">
                            <option>EUR</option>
                            <option>USD</option>
                            <option>GBP</option>
                          </select>
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{lm.requiredField}</p>}
                      </div>
                      <Field label={lm.step2.duration} value={duration} onChange={(v) => { setDuration(v); setErrors(p => ({ ...p, duration: false })); }} type="number" placeholder="12" min="1" max="360" error={errors.duration} errorText={lm.requiredField} />
                      <Field label={lm.step2.monthlyIncome} value={monthlyIncome} onChange={(v) => { setMonthlyIncome(v); setErrors(p => ({ ...p, monthlyIncome: false })); }} type="number" placeholder="0" min="0" error={errors.monthlyIncome} errorText={lm.requiredField} />
                      <Field label={lm.step2.profession} value={profession} onChange={(v) => { setProfession(v); setErrors(p => ({ ...p, profession: false })); }} placeholder={lm.step2.profession} error={errors.profession} errorText={lm.requiredField} />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{lm.step2.employer}</label>
                        <input type="text" value={employer} onChange={(e) => setEmployer(e.target.value)} placeholder={lm.step2.employer} className="input-field" />
                      </div>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <Field label={lm.step3.bankName} value={bankName} onChange={(v) => { setBankName(v); setErrors(p => ({ ...p, bankName: false })); }} placeholder={lm.step3.bankName} error={errors.bankName} errorText={lm.requiredField} />
                      <Field label={lm.step3.iban} value={iban} onChange={(v) => { setIban(v.toUpperCase()); setErrors(p => ({ ...p, iban: false })); }} placeholder={lm.step3.iban} className="uppercase" error={errors.iban} errorText={lm.requiredField} />
                      <Field label={lm.step3.bic} value={bic} onChange={(v) => { setBic(v.toUpperCase()); setErrors(p => ({ ...p, bic: false })); }} placeholder={lm.step3.bic} className="uppercase" error={errors.bic} errorText={lm.requiredField} />
                      <Field label={lm.step3.accountHolder} value={accountHolder} onChange={(v) => { setAccountHolder(v); setErrors(p => ({ ...p, accountHolder: false })); }} placeholder={lm.step3.accountHolder} error={errors.accountHolder} errorText={lm.requiredField} />
                    </div>
                  )}
                  {step === 4 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      {[
                        { t: lm.step4.idDocument, s: `PDF, JPG (${lm.step4.maxSize})`, field: 'idDocument', file: idDocument, setter: setIdDocument },
                        { t: lm.step4.proofOfAddress, s: lm.step4.lessThan3Months, field: 'proofOfAddress', file: proofOfAddress, setter: setProofOfAddress },
                        { t: lm.step4.payslip, s: lm.step4.last3Months, field: 'payslip', file: payslip, setter: setPayslip },
                      ].map((f, i) => (
                        <label
                          key={i}
                          className={`block border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer bg-gray-50 hover:bg-white ${errors[f.field] ? 'border-red-500' : 'border-gray-300 hover:border-[#D4AF37]'}`}
                        >
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange(f.setter, f.field)} />
                          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {i === 0 ? <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></> : i === 1 ? <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></> : <><rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect><line x1="6" y1="9" x2="18" y2="9"></line><line x1="6" y1="13" x2="18" y2="13"></line><line x1="6" y1="17" x2="12" y2="17"></line></>}
                            </svg>
                          </div>
                          <p className="font-medium text-gray-900">{f.t} *</p>
                          <p className="text-xs text-gray-500 mt-2">{f.file ? f.file.name : f.s}</p>
                          {errors[f.field] && <p className="text-red-500 text-xs mt-2">{lm.fileRequired}</p>}
                        </label>
                      ))}
                    </div>
                  )}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg text-sm leading-relaxed h-64 overflow-y-auto border border-gray-200">
                        <h3 className="font-bold mb-4 text-center text-gray-900">{lm.step5.contractTitle}</h3>
                        {lm.step5.sections.map((s, i) => <p key={i} className="mb-4 text-gray-700">{s}</p>)}
                      </div>
                      <div>
                        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-lg transition-colors ${errors.acceptTerms ? 'bg-red-50 border border-red-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
                          <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => { setAcceptTerms(e.target.checked); setErrors(p => ({ ...p, acceptTerms: false })); }}
                            className="mt-1 w-5 h-5 accent-[#D4AF37]"
                          />
                          <span className="text-sm text-gray-700">{lm.step5.acceptTerms}</span>
                        </label>
                        {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{lm.mustAcceptTerms}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">{lm.step5.yourSignature}</label>
                        <SignaturePad onSign={(data) => { setSignature(data); setErrors(p => ({ ...p, signature: false })); }} lang={lang} />
                        {errors.signature && <p className="text-red-500 text-xs mt-1">{lm.signatureRequired}</p>}
                      </div>
                    </div>
                  )}
                  {step === 6 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                      </div>

                      {submitting && (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{lm.step6.finalizingTitle}</h3>
                          <p className="text-gray-600 mb-8 max-w-md mx-auto">{lm.step6.finalizingDesc}</p>
                          <div className="flex justify-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-bounce"></span>
                          </div>
                        </>
                      )}

                      {!submitting && submitError && (
                        <>
                          <p className="text-red-500 mb-6">{submitError}</p>
                          <button onClick={submitApplication} className="btn-primary">{lm.step6.retry}</button>
                        </>
                      )}

                      {!submitting && !submitError && paymentUrl && depositAmount && (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{lm.step6.linkReadyTitle}</h3>
                          <p className="text-gray-600 mb-2 max-w-md mx-auto">
                            {lm.step6.depositLabel}{' '}
                            <span className="font-bold text-[#D4AF37]">{depositAmount} {currency}</span>{' '}
                            {lm.step6.depositNote}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">{lm.step6.emailSentNote}</p>

                          {/* Choix du mode de paiement */}
                          <div className="max-w-md mx-auto mb-6">
                            <p className="text-sm font-medium text-gray-700 mb-3 text-left">
                              {lang === 'nl' ? 'Kies uw betaalmethode:' : lang === 'en' ? 'Choose your payment method:' : 'Elija su método de pago:'}
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setPaymentMethod('online')}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  paymentMethod === 'online'
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                  </svg>
                                  <span className="text-sm font-medium">
                                    {lang === 'nl' ? 'Online betalen' : lang === 'en' ? 'Pay online' : 'Pagar en línea'}
                                  </span>
                                </div>
                              </button>
                              <button
                                onClick={() => setPaymentMethod('bank')}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  paymentMethod === 'bank'
                                    ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-center gap-2">
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <line x1="2" y1="11" x2="22" y2="11"></line>
                                    <line x1="6" y1="15" x2="18" y2="15"></line>
                                  </svg>
                                  <span className="text-sm font-medium">
                                    {lang === 'nl' ? 'Bankoverschrijving' : lang === 'en' ? 'Bank transfer' : 'Transferencia bancaria'}
                                  </span>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Informations bancaires */}
                          {paymentMethod === 'bank' && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto mb-6 text-left">
                              <p className="text-sm font-semibold text-gray-900 mb-3">
                                {lang === 'nl' ? 'Bankgegevens voor overschrijving:' : lang === 'en' ? 'Bank details for transfer:' : 'Datos bancarios para transferencia:'}
                              </p>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-gray-500">
                                    {lang === 'nl' ? 'Begunstigde' : lang === 'en' ? 'Beneficiary' : 'Beneficiario'}
                                  </span>
                                  <span className="font-medium text-gray-900">Bridge Building Sp. Z.o.o.</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-gray-500">
                                    {lang === 'nl' ? 'Bank' : lang === 'en' ? 'Bank' : 'Banco'}
                                  </span>
                                  <span className="font-medium text-gray-900">Banking Circle S.A.</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                  <span className="text-gray-500">IBAN</span>
                                  <span className="font-medium text-gray-900 font-mono">LU034080000029652683</span>
                                </div>
                                <div className="flex justify-between py-1">
                                  <span className="text-gray-500">BIC/SWIFT</span>
                                  <span className="font-medium text-gray-900 font-mono">BCIRLULL</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 🔒 Bandeau sécurité paiement */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                            <p className="text-xs text-green-700 flex items-center justify-center gap-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="7" width="22" height="14" rx="2" ry="2" />
                                <path d="M1 10h22" />
                                <circle cx="12" cy="15" r="1.5" />
                              </svg>
                              {lang === 'nl' 
                                ? '🔒 Veilige betaling conform DSP2 (sterke authenticatie 3D Secure)'
                                : lang === 'en'
                                ? '🔒 Secure payment compliant with DSP2 (3D Secure strong authentication)'
                                : '🔒 Pago seguro conforme a DSP2 (autenticación fuerte 3D Secure)'}
                            </p>
                          </div>

                          {/* Bouton de paiement */}
                          {paymentMethod === 'online' ? (
                            <a 
                              href={paymentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-primary inline-block"
                            >
                              {lm.step6.payNow} →
                            </a>
                          ) : (
                            <div className="space-y-3">
                              <button
                                onClick={copyBankDetails}
                                className="btn-primary inline-block"
                              >
                                {lang === 'nl' ? '📋 Kopieer bankgegevens' : lang === 'en' ? '📋 Copy bank details' : '📋 Copiar datos bancarios'}
                              </button>
                              <p className="text-xs text-gray-500">
                                {lang === 'nl' 
                                  ? 'U kunt deze gegevens kopiëren en uw overschrijving uitvoeren via uw bank.' 
                                  : lang === 'en' 
                                  ? 'You can copy these details and make your transfer via your bank.' 
                                  : 'Puede copiar estos datos y realizar su transferencia a través de su banco.'}
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-between rounded-b-2xl">
              <button onClick={handlePrev} disabled={step === 1 || step === 6} className="px-6 py-3 text-gray-500 hover:text-black disabled:opacity-30 transition-colors font-medium">← {lm.previous}</button>
              {step < 6 && (
                <button onClick={handleNext} className="btn-primary">{lm.continue} →</button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
