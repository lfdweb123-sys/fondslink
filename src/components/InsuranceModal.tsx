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

  // Étape "final"
  const [paymentUrl, setPaymentUrl] = useState('');
  const [depositAmount, setDepositAmount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

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
    }
  }, [isOpen]);

  const totalSteps = 6;

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
      };

      // Appel vers la vraie API de paiement
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
    } catch (e) {
      setSubmitError(m.final.errorNetwork);
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
    if (step === 4) {
      if (!idDocument) e.idDocument = true;
      if (!proofOfAddress) e.proofOfAddress = true;
      if (!specificDoc) e.specificDoc = true;
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
    setStep((s) => Math.min(6, s + 1));
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
    m.docs.title,
    m.contract.title,
    t.ctaButton,
  ];

  const coverageOptions: { key: CoverageLevel; label: string; desc: string; price: number }[] = [
    { key: 'basic', label: m.coverage.basic, desc: m.coverage.basicDesc, price: t.modal.coverage.basicPrice },
    { key: 'standard', label: m.coverage.standard, desc: m.coverage.standardDesc, price: t.modal.coverage.standardPrice },
    { key: 'premium', label: m.coverage.premium, desc: m.coverage.premiumDesc, price: t.modal.coverage.premiumPrice },
  ];

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
                      <Field label={m.personal.birthDate} value={birthDate} onChange={(v) => { setBirthDate(v); setErrors(p => ({ ...p, birthDate: false })); }} type="date" error={errors.birthDate} errorText={m.requiredField} />
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
                      <Field label={m.vehicle.registrationDate} value={registrationDate} onChange={(v) => { setRegistrationDate(v); setErrors(p => ({ ...p, registrationDate: false })); }} type="date" error={errors.registrationDate} errorText={m.requiredField} />
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

                  {/* Étape 4 — documents */}
                  {step === 4 && (
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

                  {/* Étape 5 — contrat + signature */}
                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg text-sm leading-relaxed h-64 overflow-y-auto border border-gray-200">
                        <h3 className="font-bold mb-4 text-center text-gray-900">{m.contract.contractTitle}</h3>
                        {m.contract.sections.map((s, i) => <p key={i} className="mb-4 text-gray-700">{s}</p>)}
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

                  {/* Étape 6 — résultat */}
                  {step === 6 && (
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

                      {!submitting && !submitError && paymentUrl && (
                        <>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{m.final.linkReadyTitle}</h3>
                          <p className="text-gray-600 mb-2 max-w-md mx-auto">
                            {m.final.depositLabel}{' '}
                            <span className="font-bold text-[#D4AF37]">{depositAmount} €</span>{' '}
                            {m.final.depositNote}
                          </p>
                          <p className="text-sm text-gray-500 mb-8">{m.final.emailSentNote}</p>
                          <a href={paymentUrl} className="btn-primary inline-block">
                            {m.final.payNow} →
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {step >= 1 && (
              <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-between rounded-b-2xl">
                <button onClick={handlePrev} disabled={step === 6} className="px-6 py-3 text-gray-500 hover:text-black disabled:opacity-30 transition-colors font-medium">
                  ← {m.previous}
                </button>
                {step < 6 && (
                  <button onClick={handleNext} className="btn-primary">{m.continue} →</button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
