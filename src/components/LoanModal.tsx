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
  
  // Utilisation de la fonction strictement typée
  const t = getTranslations(lang as Locale);

  // Fermer avec Echap
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const steps = [
    t.form.personal, 
    t.form.financial, 
    t.form.bank, 
    t.form.docs, 
    t.form.contract, 
    t.form.payment
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative"
      >
        {/* Header Modal */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold">Demande de prêt</h2>
            <p className="text-sm text-gray-500 mt-1">Étape {step} sur {steps.length} : {steps[step-1]}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black text-2xl" aria-label="Fermer">
            ×
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-[#D4AF37] transition-all duration-500" 
            style={{ width: `${(step / steps.length) * 100}%` }}
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
                  <input placeholder="Nom" className="input-field" aria-label="Nom" />
                  <input placeholder="Prénom" className="input-field" aria-label="Prénom" />
                  <input type="date" className="input-field" aria-label="Date de naissance" />
                  <input placeholder="Nationalité" className="input-field" aria-label="Nationalité" />
                  <input placeholder="Adresse" className="input-field md:col-span-2" aria-label="Adresse" />
                  <input placeholder="Ville" className="input-field" aria-label="Ville" />
                  <input placeholder="Code postal" className="input-field" aria-label="Code postal" />
                  <input placeholder="Pays" className="input-field" aria-label="Pays" />
                  <input type="tel" placeholder="Téléphone" className="input-field" aria-label="Téléphone" />
                  <input type="email" placeholder="Email" className="input-field" aria-label="Email" />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div>
                    <label className="block text-sm font-medium mb-2">Montant demandé</label>
                    <div className="flex gap-2">
                      <input type="number" className="input-field flex-1" aria-label="Montant" />
                      <select className="input-field w-24" aria-label="Devise">
                        <option>EUR</option>
                        <option>USD</option>
                      </select>
                    </div>
                  </div>
                  <input type="number" placeholder="Durée (mois)" className="input-field" aria-label="Durée" />
                  <input type="number" placeholder="Revenu mensuel net" className="input-field" aria-label="Revenu mensuel" />
                  <input placeholder="Profession" className="input-field" aria-label="Profession" />
                  <input placeholder="Employeur actuel" className="input-field" aria-label="Employeur" />
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 max-w-md mx-auto">
                  <input placeholder="Nom de la banque" className="input-field" aria-label="Nom de la banque" />
                  <input placeholder="IBAN" className="input-field uppercase" aria-label="IBAN" />
                  <input placeholder="BIC/SWIFT" className="input-field uppercase" aria-label="BIC/SWIFT" />
                  <input placeholder="Titulaire du compte" className="input-field" aria-label="Titulaire du compte" />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
                    <p className="font-medium">Carte d'identité / Passeport</p>
                    <p className="text-xs text-gray-500 mt-2">PDF ou JPG (Max 5Mo)</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
                    <p className="font-medium">Justificatif de domicile</p>
                    <p className="text-xs text-gray-500 mt-2">Moins de 3 mois</p>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors cursor-pointer">
                    <p className="font-medium">Bulletin de salaire</p>
                    <p className="text-xs text-gray-500 mt-2">3 derniers mois</p>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg text-sm leading-relaxed h-64 overflow-y-auto border">
                    <h3 className="font-bold mb-4 text-center">CONTRAT DE PRÊT ÉLECTRONIQUE</h3>
                    <p className="mb-4">1. OBJET : Le présent contrat régit la relation entre FondsLink et l'emprunteur.</p>
                    <p className="mb-4">2. MONTANT ET DURÉE : Selon les informations fournies lors de la demande.</p>
                    <p className="mb-4">3. FRAIS : Des frais administratifs et d'ouverture de compte sont applicables avant déblocage.</p>
                    <p className="mb-4">4. SIGNATURE : La signature électronique a valeur légale équivalente à une signature manuscrite.</p>
                    <p className="mb-4">5. DONNÉES : Vos données sont traitées conformément au RGPD uniquement pour l'évaluation du prêt.</p>
                  </div>
                  
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-5 h-5 accent-[#D4AF37]" aria-label="Accepter les conditions" />
                    <span className="text-sm text-gray-700">J'ai lu et j'accepte les conditions générales du contrat de prêt.</span>
                  </label>

                  <div>
                    <label className="block text-sm font-medium mb-3">Votre signature électronique</label>
                    <SignaturePad onSign={(data) => setSignature(data)} />
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl" role="img" aria-label="Carte de crédit">💳</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Finalisation du dossier</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Veuillez régler les frais administratifs ({process.env.NEXT_PUBLIC_ADMIN_FEE_AMOUNT || '50'}€) et d'ouverture de compte ({process.env.NEXT_PUBLIC_ACCOUNT_OPENING_FEE || '25'}€) pour valider automatiquement votre prêt.
                  </p>
                  <div id="geniuspay-container" className="max-w-md mx-auto" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Modal Navigation */}
        <div className="sticky bottom-0 bg-white border-t px-8 py-6 flex justify-between">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6 py-3 text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
          >
            Précédent
          </button>
          
          {step < 6 ? (
            <button 
              onClick={() => setStep(s => Math.min(6, s + 1))}
              className="btn-primary"
            >
              Continuer
            </button>
          ) : (
            <button disabled className="btn-primary opacity-50 cursor-not-allowed">
              Paiement en attente...
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
