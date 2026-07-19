// src/components/LoanModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignaturePad from './SignaturePad';
import { getTranslations, Locale } from '@/lib/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

export default function LoanModal({ isOpen, onClose, lang }: Props) {
  const [step, setStep] = useState(1);
  const [signature, setSignature] = useState<string>('');
  
  const t = getTranslations(lang as Locale);

  // Fermer avec Echap
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Empêcher le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = [
    t.form.personal, 
    t.form.financial, 
    t.form.bank, 
    t.form.docs, 
    t.form.contract, 
    t.form.payment
  ];

  // Traductions pour les textes spécifiques
  const translations = {
    title: lang === 'nl' ? 'Lening aanvraag' : lang === 'en' ? 'Loan application' : 'Solicitud de préstamo',
    stepText: lang === 'nl' ? 'Stap' : lang === 'en' ? 'Step' : 'Paso',
    of: lang === 'nl' ? 'van' : lang === 'en' ? 'of' : 'de',
    previous: lang === 'nl' ? 'Vorige' : lang === 'en' ? 'Previous' : 'Anterior',
    continue: lang === 'nl' ? 'Doorgaan' : lang === 'en' ? 'Continue' : 'Continuar',
    paymentWaiting: lang === 'nl' ? 'Betaling in afwachting...' : lang === 'en' ? 'Payment pending...' : 'Pago pendiente...',
    
    // Étape 1 - Personnel
    lastName: lang === 'nl' ? 'Achternaam' : lang === 'en' ? 'Last name' : 'Apellido',
    firstName: lang === 'nl' ? 'Voornaam' : lang === 'en' ? 'First name' : 'Nombre',
    birthDate: lang === 'nl' ? 'Geboortedatum' : lang === 'en' ? 'Date of birth' : 'Fecha de nacimiento',
    nationality: lang === 'nl' ? 'Nationaliteit' : lang === 'en' ? 'Nationality' : 'Nacionalidad',
    address: lang === 'nl' ? 'Adres' : lang === 'en' ? 'Address' : 'Dirección',
    city: lang === 'nl' ? 'Stad' : lang === 'en' ? 'City' : 'Ciudad',
    postalCode: lang === 'nl' ? 'Postcode' : lang === 'en' ? 'Postal code' : 'Código postal',
    country: lang === 'nl' ? 'Land' : lang === 'en' ? 'Country' : 'País',
    phone: lang === 'nl' ? 'Telefoon' : lang === 'en' ? 'Phone' : 'Teléfono',
    email: lang === 'nl' ? 'E-mail' : lang === 'en' ? 'Email' : 'Correo electrónico',
    
    // Étape 2 - Financier
    amountRequested: lang === 'nl' ? 'Gevraagd bedrag' : lang === 'en' ? 'Amount requested' : 'Cantidad solicitada',
    currency: lang === 'nl' ? 'Valuta' : lang === 'en' ? 'Currency' : 'Moneda',
    duration: lang === 'nl' ? 'Looptijd (maanden)' : lang === 'en' ? 'Duration (months)' : 'Duración (meses)',
    monthlyIncome: lang === 'nl' ? 'Netto maandinkomen' : lang === 'en' ? 'Net monthly income' : 'Ingreso mensual neto',
    profession: lang === 'nl' ? 'Beroep' : lang === 'en' ? 'Profession' : 'Profesión',
    employer: lang === 'nl' ? 'Huidige werkgever' : lang === 'en' ? 'Current employer' : 'Empleador actual',
    
    // Étape 3 - Banque
    bankName: lang === 'nl' ? 'Banknaam' : lang === 'en' ? 'Bank name' : 'Nombre del banco',
    iban: lang === 'nl' ? 'IBAN' : lang === 'en' ? 'IBAN' : 'IBAN',
    bic: lang === 'nl' ? 'BIC/SWIFT' : lang === 'en' ? 'BIC/SWIFT' : 'BIC/SWIFT',
    accountHolder: lang === 'nl' ? 'Rekeninghouder' : lang === 'en' ? 'Account holder' : 'Titular de la cuenta',
    
    // Étape 4 - Documents
    idDocument: lang === 'nl' ? 'Identiteitskaart / Paspoort' : lang === 'en' ? 'ID Card / Passport' : 'Documento de identidad / Pasaporte',
    maxSize: lang === 'nl' ? 'Max 5MB' : lang === 'en' ? 'Max 5MB' : 'Máx 5MB',
    proofOfAddress: lang === 'nl' ? 'Bewijs van adres' : lang === 'en' ? 'Proof of address' : 'Comprobante de domicilio',
    lessThan3Months: lang === 'nl' ? 'Minder dan 3 maanden' : lang === 'en' ? 'Less than 3 months' : 'Menos de 3 meses',
    payslip: lang === 'nl' ? 'Loonstrook' : lang === 'en' ? 'Payslip' : 'Nómina',
    last3Months: lang === 'nl' ? 'Laatste 3 maanden' : lang === 'en' ? 'Last 3 months' : 'Últimos 3 meses',
    
    // Étape 5 - Contrat
    contractTitle: lang === 'nl' ? 'ELEKTRONISCHE LENINGSOVEREENKOMST' : lang === 'en' ? 'ELECTRONIC LOAN AGREEMENT' : 'CONTRATO DE PRÉSTAMO ELECTRÓNICO',
    contractSection1: lang === 'nl' 
      ? '1. DOEL: Deze overeenkomst regelt de relatie tussen FondsLink en de lener.' 
      : lang === 'en' 
        ? '1. PURPOSE: This agreement governs the relationship between FondsLink and the borrower.' 
        : '1. OBJETO: El presente contrato regula la relación entre FondsLink y el prestatario.',
    contractSection2: lang === 'nl'
      ? '2. BEDRAG EN LOOPTIJD: Volgens de informatie verstrekt bij de aanvraag.'
      : lang === 'en'
        ? '2. AMOUNT AND DURATION: According to the information provided during the application.'
        : '2. IMPORTE Y DURACIÓN: Según la información proporcionada durante la solicitud.',
    contractSection3: lang === 'nl'
      ? '3. KOSTEN: Administratieve kosten en kosten voor het openen van een rekening zijn van toepassing vóór uitbetaling.'
      : lang === 'en'
        ? '3. FEES: Administrative and account opening fees are applicable before disbursement.'
        : '3. GASTOS: Se aplican gastos administrativos y de apertura de cuenta antes del desembolso.',
    contractSection4: lang === 'nl'
      ? '4. HANDTEKENING: De elektronische handtekening heeft dezelfde juridische waarde als een handgeschreven handtekening.'
      : lang === 'en'
        ? '4. SIGNATURE: The electronic signature has the same legal value as a handwritten signature.'
        : '4. FIRMA: La firma electrónica tiene el mismo valor legal que una firma manuscrita.',
    contractSection5: lang === 'nl'
      ? '5. GEGEVENS: Uw gegevens worden verwerkt in overeenstemming met de AVG, alleen voor de beoordeling van de lening.'
      : lang === 'en'
        ? '5. DATA: Your data is processed in accordance with GDPR, solely for loan assessment.'
        : '5. DATOS: Sus datos se procesan de conformidad con el RGPD, únicamente para la evaluación del préstamo.',
    acceptTerms: lang === 'nl'
      ? 'Ik heb de algemene voorwaarden van de leningsovereenkomst gelezen en ga ermee akkoord.'
      : lang === 'en'
        ? 'I have read and agree to the terms and conditions of the loan agreement.'
        : 'He leído y acepto los términos y condiciones del contrato de préstamo.',
    yourSignature: lang === 'nl' ? 'Uw elektronische handtekening' : lang === 'en' ? 'Your electronic signature' : 'Su firma electrónica',
    
    // Étape 6 - Paiement
    finalizingTitle: lang === 'nl' ? 'Afronding van het dossier' : lang === 'en' ? 'Finalizing the file' : 'Finalización del expediente',
    finalizingDesc: lang === 'nl'
      ? `Gelieve de administratieve kosten (${process.env.NEXT_PUBLIC_ADMIN_FEE_AMOUNT || '50'}€) en de kosten voor het openen van een rekening (${process.env.NEXT_PUBLIC_ACCOUNT_OPENING_FEE || '25'}€) te betalen om uw lening automatisch te valideren.`
      : lang === 'en'
        ? `Please pay the administrative fees (${process.env.NEXT_PUBLIC_ADMIN_FEE_AMOUNT || '50'}€) and account opening fees (${process.env.NEXT_PUBLIC_ACCOUNT_OPENING_FEE || '25'}€) to automatically validate your loan.`
        : `Por favor, pague las tasas administrativas (${process.env.NEXT_PUBLIC_ADMIN_FEE_AMOUNT || '50'}€) y de apertura de cuenta (${process.env.NEXT_PUBLIC_ACCOUNT_OPENING_FEE || '25'}€) para validar automáticamente su préstamo.`,
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
            {/* Header Modal */}
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{translations.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {translations.stepText} {step} {translations.of} {steps.length} : {steps[step-1]}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-black text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" 
                aria-label={lang === 'nl' ? 'Sluiten' : lang === 'en' ? 'Close' : 'Cerrar'}
              >
                ×
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-100">
              <motion.div 
                className="h-full bg-[#D4AF37]"
                initial={{ width: 0 }}
                animate={{ width: `${(step / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Contenu des étapes */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {step === 1 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.lastName} *</label>
                        <input placeholder={translations.lastName} className="input-field" required aria-label={translations.lastName} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.firstName} *</label>
                        <input placeholder={translations.firstName} className="input-field" required aria-label={translations.firstName} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.birthDate} *</label>
                        <input type="date" className="input-field" required aria-label={translations.birthDate} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.nationality} *</label>
                        <input placeholder={translations.nationality} className="input-field" required aria-label={translations.nationality} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.address} *</label>
                        <input placeholder={translations.address} className="input-field" required aria-label={translations.address} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.city} *</label>
                        <input placeholder={translations.city} className="input-field" required aria-label={translations.city} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.postalCode} *</label>
                        <input placeholder={translations.postalCode} className="input-field" required aria-label={translations.postalCode} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.country} *</label>
                        <input placeholder={translations.country} className="input-field" required aria-label={translations.country} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.phone} *</label>
                        <input type="tel" placeholder={translations.phone} className="input-field" required aria-label={translations.phone} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.email} *</label>
                        <input type="email" placeholder={translations.email} className="input-field" required aria-label={translations.email} />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.amountRequested} *</label>
                        <div className="flex gap-2">
                          <input type="number" className="input-field flex-1" placeholder="0" min="0" required aria-label={translations.amountRequested} />
                          <select className="input-field w-24" aria-label={translations.currency}>
                            <option>EUR</option>
                            <option>USD</option>
                            <option>GBP</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.duration} *</label>
                        <input type="number" placeholder="12" className="input-field" min="1" max="360" required aria-label={translations.duration} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.monthlyIncome} *</label>
                        <input type="number" placeholder="0" className="input-field" min="0" required aria-label={translations.monthlyIncome} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.profession} *</label>
                        <input placeholder={translations.profession} className="input-field" required aria-label={translations.profession} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.employer}</label>
                        <input placeholder={translations.employer} className="input-field" aria-label={translations.employer} />
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.bankName} *</label>
                        <input placeholder={translations.bankName} className="input-field" required aria-label={translations.bankName} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.iban} *</label>
                        <input placeholder={translations.iban} className="input-field uppercase" required aria-label={translations.iban} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.bic} *</label>
                        <input placeholder={translations.bic} className="input-field uppercase" required aria-label={translations.bic} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{translations.accountHolder} *</label>
                        <input placeholder={translations.accountHolder} className="input-field" required aria-label={translations.accountHolder} />
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-gray-50 hover:bg-white">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                          </svg>
                        </div>
                        <p className="font-medium text-gray-900">{translations.idDocument} *</p>
                        <p className="text-xs text-gray-500 mt-2">PDF, JPG ({translations.maxSize})</p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-gray-50 hover:bg-white">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <p className="font-medium text-gray-900">{translations.proofOfAddress} *</p>
                        <p className="text-xs text-gray-500 mt-2">{translations.lessThan3Months}</p>
                      </div>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer bg-gray-50 hover:bg-white">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
                            <line x1="6" y1="9" x2="18" y2="9"></line>
                            <line x1="6" y1="13" x2="18" y2="13"></line>
                            <line x1="6" y1="17" x2="12" y2="17"></line>
                          </svg>
                        </div>
                        <p className="font-medium text-gray-900">{translations.payslip} *</p>
                        <p className="text-xs text-gray-500 mt-2">{translations.last3Months}</p>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg text-sm leading-relaxed h-64 overflow-y-auto border border-gray-200">
                        <h3 className="font-bold mb-4 text-center text-gray-900">{translations.contractTitle}</h3>
                        <p className="mb-4 text-gray-700">{translations.contractSection1}</p>
                        <p className="mb-4 text-gray-700">{translations.contractSection2}</p>
                        <p className="mb-4 text-gray-700">{translations.contractSection3}</p>
                        <p className="mb-4 text-gray-700">{translations.contractSection4}</p>
                        <p className="mb-4 text-gray-700">{translations.contractSection5}</p>
                      </div>
                      
                      <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input type="checkbox" className="mt-1 w-5 h-5 accent-[#D4AF37]" aria-label={translations.acceptTerms} />
                        <span className="text-sm text-gray-700">{translations.acceptTerms}</span>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">{translations.yourSignature}</label>
                        <SignaturePad onSign={(data) => setSignature(data)} />
                      </div>
                    </div>
                  )}

                  {step === 6 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                          <line x1="1" y1="10" x2="23" y2="10"></line>
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{translations.finalizingTitle}</h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        {translations.finalizingDesc}
                      </p>
                      <div id="geniuspay-container" className="max-w-md mx-auto" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Modal Navigation */}
            <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-between rounded-b-2xl">
              <button 
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-6 py-3 text-gray-500 hover:text-black disabled:opacity-30 transition-colors font-medium"
              >
                ← {translations.previous}
              </button>
              
              {step < 6 ? (
                <button 
                  onClick={() => setStep(s => Math.min(6, s + 1))}
                  className="btn-primary"
                >
                  {translations.continue} →
                </button>
              ) : (
                <button disabled className="btn-primary opacity-50 cursor-not-allowed">
                  {translations.paymentWaiting}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
