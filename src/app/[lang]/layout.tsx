// src/app/[lang]/layout.tsx
'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getTranslations, locales } from '@/lib/i18n';
import LoanModal from '@/components/LoanModal';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = params as any;
  const t = getTranslations(lang);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const contactEmail = 
    lang === 'nl' ? 'contact@fondslink.com' :
    lang === 'en' ? 'contactus@fondslink.com' :
    'contacto@fondslink.com';

  return (
    <html lang={lang}>
      <body className={`${inter.className} bg-white text-black antialiased`}>
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo */}
              <Link href={`/${lang}`} className="text-2xl font-bold tracking-tight flex-shrink-0">
                FONDS<span className="text-[#D4AF37]">LINK</span>
              </Link>
              
              {/* Navigation Desktop - Liens centrés */}
              <nav className="hidden md:flex items-center justify-center flex-1 gap-8">
                <Link 
                  href={`/${lang}`} 
                  className={`text-sm font-medium transition-colors ${
                    pathname === `/${lang}` ? 'text-[#D4AF37]' : 'text-gray-700 hover:text-[#D4AF37]'
                  }`}
                >
                  {t.nav.home}
                </Link>
                <Link 
                  href={`/${lang}/contact`} 
                  className={`text-sm font-medium transition-colors ${
                    pathname.includes('/contact') ? 'text-[#D4AF37]' : 'text-gray-700 hover:text-[#D4AF37]'
                  }`}
                >
                  {t.nav.contact}
                </Link>
              </nav>

              {/* Partie droite : Langues + Bouton Apply */}
              <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                {/* Sélecteur de langue */}
                <div className="flex items-center gap-2 text-xs">
                  {locales.map((locale) => (
                    <Link 
                      key={locale} 
                      href={`/${locale}`}
                      className={`px-2 py-1 rounded transition-colors ${
                        lang === locale 
                          ? 'font-bold text-[#D4AF37] bg-[#D4AF37]/10' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {locale.toUpperCase()}
                    </Link>
                  ))}
                </div>

                {/* Bouton Apply - Noir, seul à droite */}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary text-sm cursor-pointer whitespace-nowrap"
                >
                  {t.nav.apply}
                </button>
              </div>

              {/* Bouton Menu Mobile */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMobileMenuOpen ? (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white">
              <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
                <Link 
                  href={`/${lang}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-2"
                >
                  {t.nav.home}
                </Link>
                <Link 
                  href={`/${lang}/contact`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-gray-700 hover:text-[#D4AF37] transition-colors py-2"
                >
                  {t.nav.contact}
                </Link>
                
                <div className="flex gap-2 py-2">
                  {locales.map((locale) => (
                    <Link 
                      key={locale} 
                      href={`/${locale}`}
                      className={`px-3 py-1 rounded text-xs ${
                        lang === locale 
                          ? 'font-bold text-[#D4AF37] bg-[#D4AF37]/10' 
                          : 'text-gray-400'
                      }`}
                    >
                      {locale.toUpperCase()}
                    </Link>
                  ))}
                </div>
                
                <button 
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary text-sm w-full"
                >
                  {t.nav.apply}
                </button>
              </div>
            </div>
          )}
        </header>

        {/* MAIN CONTENT */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-black text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  FONDS<span className="text-[#D4AF37]">LINK</span>
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  {lang === 'nl' 
                    ? 'Professioneel platform voor online leningaanvragen. Veiligheid, snelheid en transparantie.' 
                    : lang === 'en' 
                      ? 'Professional platform for online loan applications. Security, speed and transparency.' 
                      : 'Plataforma profesional para solicitudes de préstamos en línea. Seguridad, rapidez y transparencia.'
                  }
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-[#D4AF37]">
                  {lang === 'nl' ? 'Contact' : lang === 'en' ? 'Contact' : 'Contacto'}
                </h4>
                <a 
                  href={`mailto:${contactEmail}`} 
                  className="text-gray-300 hover:text-white transition-colors block mb-2"
                >
                  {contactEmail}
                </a>
                <p className="text-gray-500 text-sm">
                  {lang === 'nl' 
                    ? 'Meertalige ondersteuning 24/7' 
                    : lang === 'en' 
                      ? 'Multilingual support 24/7' 
                      : 'Soporte multilingüe 24/7'
                  }
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-[#D4AF37]">
                  {lang === 'nl' ? 'Juridisch' : lang === 'en' ? 'Legal' : 'Legal'}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  &copy; {new Date().getFullYear()} FondsLink. 
                  {lang === 'nl' 
                    ? ' Alle rechten voorbehouden.' 
                    : lang === 'en' 
                      ? ' All rights reserved.' 
                      : ' Todos los derechos reservados.'
                  }
                  <br />
                  {t.footer.legal}
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="flex gap-6 text-sm text-gray-400 mb-4 md:mb-0">
                <Link href={`/${lang}`} className="hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
                <Link href={`/${lang}/contact`} className="hover:text-white transition-colors">
                  {t.nav.contact}
                </Link>
              </div>
              <p className="text-gray-500 text-xs">
                FondsLink B.V. - KVK 12345678 - AFM vergunning nr. 12012345
              </p>
            </div>
          </div>
        </footer>

        {/* Modal */}
        <LoanModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          lang={lang} 
        />
      </body>
    </html>
  );
}
