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
};

export default nextConfig;
