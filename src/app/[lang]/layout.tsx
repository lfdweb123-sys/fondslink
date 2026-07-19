// src/app/[lang]/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Link from 'next/link';
import { getTranslations, locales, Locale } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);
  
  return {
    title: `FondsLink - ${t.hero.title}`,
    description: t.hero.subtitle,
    openGraph: {
      title: `FondsLink - ${t.hero.title}`,
      description: t.hero.subtitle,
      url: `https://fondslink.com/${lang}`,
      siteName: 'FondsLink',
      locale: lang === 'nl' ? 'nl_NL' : lang === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang as Locale);

  const contactEmail = 
    lang === 'nl' ? 'contact@fondslink.com' :
    lang === 'en' ? 'contactus@fondslink.com' :
    'contacto@fondslink.com';

  return (
    <html lang={lang}>
      <body className={`${inter.className} bg-white text-black antialiased`}>
        {/* HEADER */}
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href={`/${lang}`} className="text-2xl font-bold tracking-tight">
              FONDS<span className="text-[#D4AF37]">LINK</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href={`/${lang}`} className="text-sm font-medium hover:text-[#D4AF37] transition-colors">
                {t.nav.home}
              </Link>
              <Link href={`/${lang}/contact`} className="text-sm font-medium hover:text-[#D4AF37] transition-colors">
                {t.nav.contact}
              </Link>
              
              {/* Sélecteur de langue */}
              <div className="flex gap-2 text-xs border-l pl-6 ml-2">
                {locales.map((locale) => (
                  <Link 
                    key={locale} 
                    href={`/${locale}`}
                    className={lang === locale ? 'font-bold text-[#D4AF37]' : 'text-gray-400 hover:text-gray-600 transition-colors'}
                  >
                    {locale.toUpperCase()}
                  </Link>
                ))}
              </div>

              <Link href={`/${lang}/contact?openLoan=true`} className="btn-primary text-sm">
                {t.nav.apply}
              </Link>
            </nav>

            {/* Menu mobile burger - optionnel */}
            <button className="md:hidden p-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
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
                  {lang === 'nl' ? 'Professioneel platform voor online leningaanvragen. Veiligheid, snelheid en transparantie.' :
                   lang === 'en' ? 'Professional platform for online loan applications. Security, speed and transparency.' :
                   'Plataforma profesional para solicitudes de préstamos en línea. Seguridad, rapidez y transparencia.'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-[#D4AF37]">
                  {lang === 'nl' ? 'Contact' : lang === 'en' ? 'Contact' : 'Contacto'}
                </h4>
                <a href={`mailto:${contactEmail}`} className="text-gray-300 hover:text-white transition-colors block mb-2">
                  {contactEmail}
                </a>
                <p className="text-gray-500 text-sm">
                  {lang === 'nl' ? 'Meertalige ondersteuning 24/7' :
                   lang === 'en' ? 'Multilingual support 24/7' :
                   'Soporte multilingüe 24/7'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-[#D4AF37]">
                  {lang === 'nl' ? 'Juridisch' : lang === 'en' ? 'Legal' : 'Legal'}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  &copy; {new Date().getFullYear()} FondsLink. 
                  {lang === 'nl' ? ' Alle rechten voorbehouden.' :
                   lang === 'en' ? ' All rights reserved.' :
                   ' Todos los derechos reservados.'}
                  <br />
                  {t.footer.legal}
                </p>
              </div>
            </div>
            
            {/* Liens rapides en bas */}
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-wrap justify-between items-center">
              <div className="flex gap-6 text-sm text-gray-400">
                <Link href={`/${lang}`} className="hover:text-white transition-colors">
                  {t.nav.home}
                </Link>
                <Link href={`/${lang}/contact`} className="hover:text-white transition-colors">
                  {t.nav.contact}
                </Link>
              </div>
              <p className="text-gray-500 text-xs mt-4 md:mt-0">
                FondsLink B.V. - KVK 12345678 - AFM vergunning nr. 12012345
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
