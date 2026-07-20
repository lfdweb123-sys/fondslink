// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://fondslink.com'),
  title: { template: '%s | FondsLink', default: 'FondsLink - Professionele Leningen' },
  description: 'Veilige, snelle en volledig online leningsaanvragen. Conform Europese regelgeving.',
  openGraph: {
    title: 'FondsLink - Professional Loans',
    description: 'Secure, fast and fully online loan applications.',
    url: 'https://fondslink.com',
    siteName: 'FondsLink',
    locale: 'nl_NL',
    type: 'website',
    images: ['/images/og-image.jpg'],
  },
  twitter: { card: 'summary_large_image', title: 'FondsLink', description: 'Professional online loans' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg', apple: '/apple-icon.png' },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
