import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/uploads/**' },
      { protocol: 'https', hostname: '**.supabase.co' },
      // produtos de exemplo (mocks): usaremos URLs públicas até a API ter imagens reais
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
  typedRoutes: true,
  experimental: {
    serverActions: {
      // Permite payloads maiores em Server Actions — necessário pra upload de várias fotos
      // na criação do produto (cada foto pode ter alguns MB). Default do Next é 1MB.
      bodySizeLimit: '25mb',
    },
  },
};

export default nextConfig;
