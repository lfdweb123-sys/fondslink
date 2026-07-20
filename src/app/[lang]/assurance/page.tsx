// src/app/[lang]/assurance/page.tsx
'use client';

import { useState, use } from 'react';
import InsuranceModal from '@/components/InsuranceModal';
import { getInsuranceTranslations } from '@/lib/i18n-insurance';
import type { Locale } from '@/lib/i18n';

export default function InsurancePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const t = getInsuranceTranslations(lang as Locale);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* 🔒 Bandeau sécurité */}
      <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-6 py-4 mb-10 text-center flex items-center justify-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="7" width="22" height="14" rx="2" ry="2" />
          <path d="M1 10h22" />
          <circle cx="12" cy="15" r="1.5" />
        </svg>
        <span>{t.securePaymentBanner}</span>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.pageTitle}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t.pageSubtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border border-gray-200 rounded-2xl p-8 bg-white hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm14 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM5 17V9l2-5h10l2 5v8" />
            </svg>
          </div>
          <h2 className="font-semibold text-gray-900 mb-2">{t.modal.typeSelection.vehicle}</h2>
          <p className="text-sm text-gray-500">{t.modal.typeSelection.vehicleDesc}</p>
        </div>
        <div className="border border-gray-200 rounded-2xl p-8 bg-white hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h2 className="font-semibold text-gray-900 mb-2">{t.modal.typeSelection.home}</h2>
          <p className="text-sm text-gray-500">{t.modal.typeSelection.homeDesc}</p>
        </div>
      </div>

      {/* Mentions légales */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">📋 Informations importantes</h3>
        <ul className="text-xs text-gray-600 space-y-2">
          <li>• {t.legalInfo.withdrawal}</li>
          <li>• {t.legalInfo.gdpr}</li>
          <li>• {t.legalInfo.compliance}</li>
        </ul>
      </div>

      <div className="text-center">
        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
          {t.ctaButton}
        </button>
      </div>

      <InsuranceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} lang={lang} />
    </div>
  );
}
