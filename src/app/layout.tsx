import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/lib/providers/query-provider';
import { CartProvider } from '@/lib/providers/cart-provider';
import { StoreConfigProvider } from '@/lib/providers/store-config-provider';
import { MiniCart } from '@/components/cart/mini-cart';
import { getStoreConfig } from '@/lib/api/endpoints/store-config';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mabruk Semijoias — Joias atemporais',
    template: '%s · Mabruk Semijoias',
  },
  description:
    'Mabruk Semijoias — coleção atemporal de anéis, brincos, colares e pulseiras. Banho ouro 18k, prata 925 e aço inoxidável com garantia.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeConfig = await getStoreConfig();

  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <QueryProvider>
          <StoreConfigProvider value={storeConfig}>
            <CartProvider>
              {children}
              <MiniCart />
            </CartProvider>
          </StoreConfigProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
