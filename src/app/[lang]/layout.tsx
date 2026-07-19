import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Link from 'next/link';
import { translations } from '@/lib/translations';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const t = translations[params.lang as keyof typeof translations] || translations.nl;
  return {
    title: `FondsLink - ${t.hero.title}`,
    description: t.hero.subtitle,
    openGraph: {
      title: `FondsLink - ${t.hero.title}`,
      description: t.hero.subtitle,
      url: `https://fondslink.com/${params.lang}`,
      siteName: 'FondsLink',
      locale: params.lang === 'nl' ? 'nl_NL' : params.lang === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const t = translations[params.lang as keyof typeof translations] || translations.nl;
  const contactEmail = 
    params.lang === 'nl' ? 'contact@fondslink.com' :
    params.lang === 'en' ? 'contactus@fondslink.com' :
    'contacto@fondslink.com';

  return (
    <html lang={params.lang}>
      <body className={inter.className}>
        {/* HEADER */}
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href={`/${params.lang}`} className="text-2xl font-bold tracking-tight">
              FONDS<span className="text-[#D4AF37]">LINK</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <Link href={`/${params.lang}`} className="text-sm font-medium hover:text-[#D4AF37] transition-colors">{t.nav.home}</Link>
              <Link href={`/${params.lang}/contact`} className="text-sm font-medium hover:text-[#D4AF37] transition-colors">{t.nav.contact}</Link>
              
              {/* Sélecteur de langue simplifié */}
              <div className="flex gap-2 text-xs border-l pl-6 ml-2">
                <Link href="/nl" className={params.lang === 'nl' ? 'font-bold text-[#D4AF37]' : 'text-gray-400'}>NL</Link>
                <Link href="/en" className={params.lang === 'en' ? 'font-bold text-[#D4AF37]' : 'text-gray-400'}>EN</Link>
                <Link href="/es" className={params.lang === 'es' ? 'font-bold text-[#D4AF37]' : 'text-gray-400'}>ES</Link>
              </div>

              <button className="btn-primary text-sm">{t.nav.apply}</button>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="pt-20 min-h-screen">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-black text-white py-16 mt-20">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">FONDS<span className="text-[#D4AF37]">LINK</span></h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Plateforme professionnelle de demande de prêt en ligne. Sécurité, rapidité et transparence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#D4AF37]">Contact</h4>
              <a href={`mailto:${contactEmail}`} className="text-gray-300 hover:text-white transition-colors block mb-2">
                {contactEmail}
              </a>
              <p className="text-gray-500 text-sm">Support multilingue 24/7</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#D4AF37]">Légal</h4>
              <p className="text-gray-500 text-xs leading-relaxed">
                © {new Date().getFullYear()} FondsLink. Tous droits réservés.<br/>
                Conforme aux réglementations financières européennes.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}