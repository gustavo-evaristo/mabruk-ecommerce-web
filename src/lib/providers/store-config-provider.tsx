'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { StoreConfig } from '@/lib/api/endpoints/store-config';

const FALLBACK: StoreConfig = {
  freeShippingThresholdCents: 30000,
  maxInstallments: 6,
  pixDiscountPercent: 0,
};

const StoreConfigContext = createContext<StoreConfig>(FALLBACK);

export function StoreConfigProvider({
  value,
  children,
}: {
  value: StoreConfig;
  children: ReactNode;
}) {
  return <StoreConfigContext.Provider value={value}>{children}</StoreConfigContext.Provider>;
}

/**
 * Lê configs públicas da loja (frete grátis, parcelamento, desconto PIX).
 * Disponível em qualquer Client Component dentro do layout B2C.
 */
export function useStoreConfig(): StoreConfig {
  return useContext(StoreConfigContext);
}
