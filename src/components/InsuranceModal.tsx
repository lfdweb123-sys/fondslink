// src/components/InsuranceModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignaturePad from './SignaturePad';
import { getInsuranceTranslations } from '@/lib/i18n-insurance';
import type { Locale } from '@/lib/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

type InsuranceType = 'vehicle' | 'home';
type CoverageLevel = 'basic' | 'standard' | 'premium';

// ── Sélecteur de date personnalisé (identique au formulaire de prêt) ──
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

// ── Champ texte contrôlé avec affichage d'erreur ──
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

function Select({
  label, value, onChange, options, error, errorText,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; error?: boolean; errorText?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{errorText}</p>}
    </div>
  );
}

export default function InsuranceModal({ isOpen, onClose, lang }: Props) {
  const t = getInsuranceTranslations(lang as Locale);
  const m = t.modal;

  const [step, setStep] = useState(0);
  const [insuranceType, setInsuranceType] = useState<InsuranceType | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [signature, setSignature] = useState<string>('');

  // Étape "personal"
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

  // Étape "vehicle"
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [usageType, setUsageType] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [annualMileage, setAnnualMileage] = useState('');

  // Étape "home"
  const [propertyType, setPropertyType] = useState('');
  const [surfaceArea, setSurfaceArea] = useState('');
  const [constructionYear, setConstructionYear] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [hasAlarm, setHasAlarm] = useState(false);
  const [occupancyStatus, setOccupancyStatus] = useState('');

  // Étape "coverage"
  const [coverageLevel, setCoverageLevel] = useState<CoverageLevel>('standard');

  // Étape "docs"
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfAddress, setProofOfAddress] = useState<File | null>(null);
  const [specificDoc, setSpecificDoc] = useState<File | null>(null);

  // Étape "contract"
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptGDPR, setAcceptGDPR] = useState(false);

  // Étape "final"
  const [paymentUrl, setPaymentUrl] = useState('');
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'bank'>('online');
  const [orderId, setOrderId] = useState('');

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
      setStep(0);
      setInsuranceType(null);
      setErrors({});
      setPaymentUrl('');
      setSubmitError('');
      setDepositAmount(null);
      setPaymentMethod('online');
      setOrderId('');
    }
  }, [isOpen]);

  const totalSteps = 7;

  const submitApplication = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const applicationData = {
        insuranceType,
        lastName, firstName, birthDate, nationality, address, city, postalCode, country, phone, email,
        ...(insuranceType === 'vehicle'
          ? { brand, model, year, plateNumber, registrationDate, usageType, estimatedValue, annualMileage }
          : { propertyType, surfaceArea, constructionYear, propertyValue, numberOfRooms, hasAlarm, occupancyStatus }),
        coverageLevel,
        signature,
        acceptGDPR,
        paymentMethod,
      };

      const res = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationData, lang }),
      });

      const data = await res.json();

      if (!data.success) {
        setSubmitError(data.message || m.final.errorGeneric);
        setSubmitting(false);
        return;
      }

      setPaymentUrl(data.paymentUrl);
      setDepositAmount(data.depositAmount);
      setOrderId(data.orderId || '');
    } catch (e) {
      setSubmitError(m.final.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 7 && !paymentUrl && !submitting) {
      submitApplication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!isOpen) return null;

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
    if (step === 2 && insuranceType === 'vehicle') {
      if (!brand.trim()) e.brand = true;
      if (!model.trim()) e.model = true;
      if (!year || Number(year) <= 1900) e.year = true;
      if (!plateNumber.trim()) e.plateNumber = true;
      if (!registrationDate.trim()) e.registrationDate = true;
      if (!usageType) e.usageType = true;
      if (!estimatedValue || Number(estimatedValue) <= 0) e.estimatedValue = true;
      if (!annualMileage || Number(annualMileage) < 0) e.annualMileage = true;
    }
    if (step === 2 && insuranceType === 'home') {
      if (!propertyType) e.propertyType = true;
      if (!surfaceArea || Number(surfaceArea) <= 0) e.surfaceArea = true;
      if (!constructionYear || Number(constructionYear) <= 1800) e.constructionYear = true;
      if (!propertyValue || Number(propertyValue) <= 0) e.propertyValue = true;
      if (!numberOfRooms || Number(numberOfRooms) <= 0) e.numberOfRooms = true;
      if (!occupancyStatus) e.occupancyStatus = true;
    }
    if (step === 3) {
      // Coverage - pas de validation, c'est un choix
    }
    if (step === 4) {
      // IPID - pas de validation
    }
    if (step === 5) {
      if (!idDocument) e.idDocument = true;
      if (!proofOfAddress) e.proofOfAddress = true;
      if (!specificDoc) e.specificDoc = true;
    }
    if (step === 6) {
      if (!acceptTerms) e.acceptTerms = true;
      if (!acceptGDPR) e.acceptGDPR = true;
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
    setStep((s) => Math.min(7, s + 1));
  };

  const handlePrev = () => {
    setErrors({});
    if (step === 1) {
      setStep(0);
      setInsuranceType(null);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const handleFileChange = (setter: (f: File | null) => void, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setter(file);
    if (file) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const stepLabels = [
    m.personal.title,
    insuranceType === 'home' ? m.home.title : m.vehicle.title,
    m.coverage.title,
    m.ipid.title,
    m.docs.title,
    m.contract.title,
    t.ctaButton,
  ];

  const coverageOptions: { key: CoverageLevel; label: string; desc: string; price: number }[] = [
    { key: 'basic', label: m.coverage.basic, desc: m.coverage.basicDesc, price: t.modal.coverage.basicPrice },
    { key: 'standard', label: m.coverage.standard, desc: m.coverage.standardDesc, price: t.modal.coverage.standardPrice },
    { key: 'premium', label: m.coverage.premium, desc: m.coverage.premiumDesc, price: t.modal.coverage.premiumPrice },
  ];

  // Obtenir le prix pour l'IPID
  const getSelectedPrice = () => {
    const opt = coverageOptions.find(o => o.key === coverageLevel);
    return opt ? opt.price : 29;
  };

  // Copier les coordonnées bancaires
  const copyBankDetails = () => {
    const bankInfo = `Bridge Building Sp. Z.o.o.\nBanking Circle S.A.\nIBAN: LU034080000029652683\nBIC: BCIRLULL\nRéférence: ${orderId || 'FL-' + Date.now().toString(36).toUpperCase()}`;
    navigator.clipboard.writeText(bankInfo);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative"
          >
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{m.title}</h2>
                {step >= 1 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {m.step} {step} {m.of} {totalSteps} : {stepLabels[step - 1]}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label={m.close}
              >
                ×
              </button>
            </div>

            {step >= 1 && (
              <div className="w-full h-1 bg-gray-100">
                <motion.div
                  className="h-full bg-[#D4AF37]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}

            {/* Bandeau sécurité paiement - toujours visible */}
            <div className="bg-green-50 border-b border-green-200 px-8 py-3 text-xs text-green-700 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="7" width="22" height="14" rx="2" ry="2" />
                <path d="M1 10h22" />
                <circle cx="12" cy="15" r="1.5" />
              </svg>
              <span>
                🔒 {m.securePayment} · {m.securePaymentDesc}
              </span>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

                  {/* Étape 0 — choix du type */}
                  {step === 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <h3 className="md:col-span-2 text-lg font-semibold text-gray-900 text-center mb-2">
                        {m.typeSelection.heading}
                      </h3>
                      <button
                        type="button"
                        onClick={() => { setInsuranceType('vehicle'); setStep(1); }}
                        className="border-2 border-gray-200 hover:border-[#D4AF37] rounded-xl p-8 text-left transition-colors bg-gray-50 hover:bg-white"
                      >
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM5 17V9l2-5h10l2 5v8" />
                          </svg>
                        </div>
                        <p className="font-semibold text-gray-900">{m.typeSelection.vehicle}</p>
                        <p className="text-sm text-gray-500 mt-1">{m.typeSelection.vehicleDesc}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setInsuranceType('home'); setStep(1); }}
                        className="border-2 border-gray-200 hover:border-[#D4AF37] rounded-xl p-8 text-left transition-colors bg-gray-50 hover:bg-white"
                      >
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        </div>
                        <p className="font-semibold text-gray-900">{m.typeSelection.home}</p>
                        <p className="text-sm text-gray-500 mt-1">{m.typeSelection.homeDesc}</p>
                      </button>
                    </div>
                  )}

                  {/* Étape 1 — infos personnelles */}
                  {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label={m.personal.lastName} value={lastName} onChange={(v) => { setLastName(v); setErrors(p => ({ ...p, lastName: false })); }} error={errors.lastName} errorText={m.requiredField} />
                      <Field label={m.personal.firstName} value={firstName} onChange={(v) => { setFirstName(v); setErrors(p => ({ ...p, firstName: false })); }} error={errors.firstName} errorText={m.requiredField} />
                      <div>
                        <DatePicker 
                          label={m.personal.birthDate} 
                          value={birthDate} 
                          onChange={(v) => { setBirthDate(v); setErrors(p => ({ ...p, birthDate: false })); }} 
                          lang={lang} 
                          error={errors.birthDate} 
                          errorText={m.requiredField} 
                        />
                      </div>
                      <Field label={m.personal.nationality} value={nationality} onChange={(v) => { setNationality(v); setErrors(p => ({ ...p, nationality: false })); }} error={errors.nationality} errorText={m.requiredField} />
                      <div className="md:col-span-2">
                        <Field label={m.personal.address} value={address} onChange={(v) => { setAddress(v); setErrors(p => ({ ...p, address: false })); }} error={errors.address} errorText={m.requiredField} />
                      </div>
                      <Field label={m.personal.city} value={city} onChange={(v) => { setCity(v); setErrors(p => ({ ...p, city: false })); }} error={errors.city} errorText={m.requiredField} />
                      <Field label={m.personal.postalCode} value={postalCode} onChange={(v) => { setPostalCode(v); setErrors(p => ({ ...p, postalCode: false })); }} error={errors.postalCode} errorText={m.requiredField} />
                      <Field label={m.personal.country} value={country} onChange={(v) => { setCountry(v); setErrors(p => ({ ...p, country: false })); }} error={errors.country} errorText={m.requiredField} />
                      <Field label={m.personal.phone} value={phone} onChange={(v) => { setPhone(v); setErrors(p => ({ ...p, phone: false })); }} type="tel" error={errors.phone} errorText={m.requiredField} />
                      <div className="md:col-span-2">
                        <Field label={m.personal.email} value={email} onChange={(v) => { setEmail(v); setErrors(p => ({ ...p, email: false })); }} type="email" error={errors.email} errorText={m.requiredField} />
                      </div>
                    </div>
                  )}

                  {/* Étape 2 — véhicule */}
                  {step === 2 && insuranceType === 'vehicle' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label={m.vehicle.brand} value={brand} onChange={(v) => { setBrand(v); setErrors(p => ({ ...p, brand: false })); }} error={errors.brand} errorText={m.requiredField} />
                      <Field label={m.vehicle.model} value={model} onChange={(v) => { setModel(v); setErrors(p => ({ ...p, model: false })); }} error={errors.model} errorText={m.requiredField} />
                      <Field label={m.vehicle.year} value={year} onChange={(v) => { setYear(v); setErrors(p => ({ ...p, year: false })); }} type="number" min="1900" error={errors.year} errorText={m.requiredField} />
                      <Field label={m.vehicle.plateNumber} value={plateNumber} onChange={(v) => { setPlateNumber(v.toUpperCase()); setErrors(p => ({ ...p, plateNumber: false })); }} className="uppercase" error={errors.plateNumber} errorText={m.requiredField} />
                      <div>
                        <DatePicker 
                          label={m.vehicle.registrationDate} 
                          value={registrationDate} 
                          onChange={(v) => { setRegistrationDate(v); setErrors(p => ({ ...p, registrationDate: false })); }} 
                          lang={lang} 
                          error={errors.registrationDate} 
                          errorText={m.requiredField} 
                        />
                      </div>
                      <Select
                        label={m.vehicle.usageType}
                        value={usageType}
                        onChange={(v) => { setUsageType(v); setErrors(p => ({ ...p, usageType: false })); }}
                        options={[
                          { value: 'personal', label: m.vehicle.usagePersonal },
                          { value: 'professional', label: m.vehicle.usageProfessional },
                          { value: 'mixed', label: m.vehicle.usageMixed },
                        ]}
                        error={errors.usageType}
                        errorText={m.requiredField}
                      />
                      <Field label={m.vehicle.estimatedValue} value={estimatedValue} onChange={(v) => { setEstimatedValue(v); setErrors(p => ({ ...p, estimatedValue: false })); }} type="number" min="0" error={errors.estimatedValue} errorText={m.requiredField} />
                      <Field label={m.vehicle.annualMileage} value={annualMileage} onChange={(v) => { setAnnualMileage(v); setErrors(p => ({ ...p, annualMileage: false })); }} type="number" min="0" error={errors.annualMileage} errorText={m.requiredField} />
                    </div>
                  )}

                  {/* Étape 2 — habitation */}
                  {step === 2 && insuranceType === 'home' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <Select
                        label={m.home.propertyType}
                        value={propertyType}
                        onChange={(v) => { setPropertyType(v); setErrors(p => ({ ...p, propertyType: false })); }}
                        options={[
                          { value: 'apartment', label: m.home.typeApartment },
                          { value: 'house', label: m.home.typeHouse },
                          { value: 'other', label: m.home.typeOther },
                        ]}
                        error={errors.propertyType}
                        errorText={m.requiredField}
                      />
                      <Field label={m.home.surfaceArea} value={surfaceArea} onChange={(v) => { setSurfaceArea(v); setErrors(p => ({ ...p, surfaceArea: false })); }} type="number" min="0" error={errors.surfaceArea} errorText={m.requiredField} />
                      <Field label={m.home.constructionYear} value={constructionYear} onChange={(v) => { setConstructionYear(v); setErrors(p => ({ ...p, constructionYear: false })); }} type="number" min="1800" error={errors.constructionYear} errorText={m.requiredField} />
                      <Field label={m.home.propertyValue} value={propertyValue} onChange={(v) => { setPropertyValue(v); setErrors(p => ({ ...p, propertyValue: false })); }} type="number" min="0" error={errors.propertyValue} errorText={m.requiredField} />
                      <Field label={m.home.numberOfRooms} value={numberOfRooms} onChange={(v) => { setNumberOfRooms(v); setErrors(p => ({ ...p, numberOfRooms: false })); }} type="number" min="1" error={errors.numberOfRooms} errorText={m.requiredField} />
                      <Select
                        label={m.home.occupancyStatus}
                        value={occupancyStatus}
                        onChange={(v) => { setOccupancyStatus(v); setErrors(p => ({ ...p, occupancyStatus: false })); }}
                        options={[
                          { value: 'owner', label: m.home.occupancyOwner },
                          { value: 'tenant', label: m.home.occupancyTenant },
                        ]}
                        error={errors.occupancyStatus}
                        errorText={m.requiredField}
                      />
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <input type="checkbox" checked={hasAlarm} onChange={(e) => setHasAlarm(e.target.checked)} className="w-5 h-5 accent-[#D4AF37]" />
                          <span className="text-sm text-gray-700">{m.home.hasAlarm}</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Étape 3 — couverture */}
                  {step === 3 && (
                    <div className="space-y-4 max-w-2xl mx-auto">
                      <h3 className="text-center font-semibold text-gray-900 mb-4">{m.coverage.coverageLevel}</h3>
                      {coverageOptions.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setCoverageLevel(opt.key)}
                          className={`w-full text-left border-2 rounded-xl p-5 transition-colors flex justify-between items-center ${
                            coverageLevel === opt.key ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-gray-900">{opt.label}</p>
                            <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#D4AF37]">{opt.price} €</p>
                            <p className="text-xs text-gray-400">/mois</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Étape 4 — IPID + RGPD + Délai de rétractation */}
                  {step === 4 && (
                    <div className="space-y-6 max-w-3xl mx-auto">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-blue-600">📋</span> {m.ipid.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">{m.ipid.subtitle}</p>

                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500">{m.ipid.productType}</p>
                            <p className="font-semibold text-gray-900">
                              {insuranceType === 'vehicle' ? m.ipid.vehicleInsurance : m.ipid.homeInsurance}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500">{m.ipid.coverageLevel}</p>
                            <p className="font-semibold text-gray-900">
                              {coverageOptions.find(o => o.key === coverageLevel)?.label}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500">{m.ipid.premium}</p>
                            <p className="font-semibold text-[#D4AF37]">{getSelectedPrice()} € / {m.ipid.month}</p>
                            <p className="text-xs text-gray-400">{m.ipid.annualPremium} {getSelectedPrice() * 12} €</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-xs text-gray-500">{m.ipid.duration}</p>
                            <p className="font-semibold text-gray-900">{m.ipid.durationValue}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <span>✅</span> {m.ipid.coveredRisks}
                            </p>
                            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                              {insuranceType === 'vehicle' ? (
                                <>
                                  <li>{m.ipid.coveredVehicle}</li>
                                  <li>{m.ipid.coveredTheft}</li>
                                  <li>{m.ipid.coveredDamage}</li>
                                </>
                              ) : (
                                <>
                                  <li>{m.ipid.coveredHome}</li>
                                  <li>{m.ipid.coveredContents}</li>
                                  <li>{m.ipid.coveredLiability}</li>
                                </>
                              )}
                            </ul>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-gray-200 border-yellow-300">
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <span>⚠️</span> {m.ipid.exclusions}
                            </p>
                            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc list-inside">
                              {insuranceType === 'vehicle' ? (
                                <>
                                  <li>{m.ipid.excludedWear}</li>
                                  <li>{m.ipid.excludedDrunk}</li>
                                </>
                              ) : (
                                <>
                                  <li>{m.ipid.excludedFlood}</li>
                                  <li>{m.ipid.excludedNegligence}</li>
                                </>
                              )}
                            </ul>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-gray-200 border-green-300">
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                              <span>🔔</span> {m.ipid.withdrawal}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{m.ipid.withdrawalText}</p>
                          </div>
                        </div>
                      </div>

                      {/* RGPD - Case à cocher */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <span>🔒</span> {m.ipid.gdprTitle}
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">{m.ipid.gdprText}</p>
                        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-lg transition-colors ${errors.acceptGDPR ? 'bg-red-50 border border-red-300' : 'bg-white hover:bg-gray-50 border border-gray-200'}`}>
                          <input
                            type="checkbox"
                            checked={acceptGDPR}
                            onChange={(e) => { setAcceptGDPR(e.target.checked); setErrors(p => ({ ...p, acceptGDPR: false })); }}
                            className="mt-1 w-5 h-5 accent-[#D4AF37]"
                          />
                          <span className="text-sm text-gray-700">{m.ipid.gdprConsent}</span>
                        </label>
                        {errors.acceptGDPR && <p className="text-red-500 text-xs mt-1">{m.mustAcceptGDPR}</p>}
                      </div>
                    </div>
                  )}

                  {/* Étape 5 — documents */}
                  {step === 5 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      {[
                        { label: m.docs.idDocument, sub: `PDF, JPG (${m.docs.maxSize})`, field: 'idDocument', file: idDocument, setter: setIdDocument },
                        { label: m.docs.proofOfAddress, sub: m.docs.lessThan3Months, field: 'proofOfAddress', file: proofOfAddress, setter: setProofOfAddress },
                        { label: insuranceType === 'vehicle' ? m.docs.vehicleRegistration : m.docs.propertyDeed, sub: '', field: 'specificDoc', file: specificDoc, setter: setSpecificDoc },
                      ].map((f, i) => (
                        <label
                          key={i}
                          className={`block border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer bg-gray-50 hover:bg-white ${errors[f.field] ? 'border-red-500' : 'border-gray-300 hover:border-[#D4AF37]'}`}
                        >
                          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange(f.setter, f.field)} />
                          <p className="font-medium text-gray-900">{f.label} *</p>
                          <p className="text-xs text-gray-500 mt-2">{f.file ? f.file.name : f.sub}</p>
                          {errors[f.field] && <p className="text-red-500 text-xs mt-2">{m.fileRequired}</p>}
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Étape 6 — contrat + signature */}
                  {step === 6 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg text-sm leading-relaxed h-64 overflow-y-auto border border-gray-200">
                        <h3 className="font-bold mb-4 text-center text-gray-900">{m.contract.contractTitle}</h3>
                        {m.contract.sections.map((s, i) => <p key={i} className="mb-4 text-gray-700">{s}</p>)}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-gray-700 font-semibold">🔔 {m.contract.withdrawalNotice}</p>
                        </div>
                      </div>
                      <div>
                        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-lg transition-colors ${errors.acceptTerms ? 'bg-red-50 border border-red-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
                          <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => { setAcceptTerms(e.target.checked); setErrors(p => ({ ...p, acceptTerms: false })); }}
                            className="mt-1 w-5 h-5 accent-[#D4AF37]"
                          />
                          <span className="text-sm text-gray-700">{m.contract.acceptTerms}</span>
                        </label>
                        {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{m.mustAcceptTerms}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">{m.contract.yourSignature}</label>
                        <SignaturePad onSign={(data) => { setSignature(data); setErrors(p => ({ ...p, signature: false })); }} lang={lang} />
                        {errors.signature && <p className="text-red-500 text-xs mt-1">{m.signatureRequired}</p>}
                      </div>
                    </div>
                  )}

                  {/* Étape 7 — résultat avec choix du mode de paiement */}
                  {step === 7 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>

                      {submitting && (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{m.final.finalizingTitle}</h3>
                          <p className="text-gray-600 mb-8 max-w-md mx-auto">{m.final.finalizingDesc}</p>
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
                          <button onClick={submitApplication} className="btn-primary">{m.final.retry}</button>
                        </>
                      )}

                      {!submitting && !submitError && paymentUrl && depositAmount && (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{m.final.linkReadyTitle}</h3>
                          <p className="text-gray-600 mb-2 max-w-md mx-auto">
                            {m.final.depositLabel}{' '}
                            <span className="font-bold text-[#D4AF37]">{depositAmount} €</span>{' '}
                            {m.final.depositNote}
                          </p>
                          <p className="text-sm text-gray-500 mb-4">{m.final.emailSentNote}</p>

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
                              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700">
                                  {lang === 'nl' 
                                    ? '⚠️ Vermeld uw referentienummer bij de overschrijving: ' 
                                    : lang === 'en' 
                                    ? '⚠️ Please mention your reference number in the transfer: ' 
                                    : '⚠️ Indique su número de referencia en la transferencia: '}
                                  <span className="font-mono font-bold">{orderId || 'FL-' + Date.now().toString(36).toUpperCase()}</span>
                                </p>
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
                              {m.final.securePayment}
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
                              {m.final.payNow} →
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

            {step >= 1 && (
              <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-between rounded-b-2xl">
                <button 
                  onClick={handlePrev} 
                  disabled={step === 7} 
                  className="px-6 py-3 text-gray-500 hover:text-black disabled:opacity-30 transition-colors font-medium"
                >
                  ← {m.previous}
                </button>
                {step < 7 && (
                  <button onClick={handleNext} className="btn-primary">
                    {m.continue} →
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
