/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit'],

  // Assure que les fichiers de polices .afm de pdfkit sont bien inclus
  // dans le build de sortie (nécessaire sur Vercel notamment)
  outputFileTracingIncludes: {
    '/api/create-payment-link': ['./node_modules/pdfkit/js/data/**'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
