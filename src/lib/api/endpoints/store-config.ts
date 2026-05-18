import { apiFetch } from '../client';

export interface StoreConfig {
  freeShippingThresholdCents: number;
  maxInstallments: number;
  pixDiscountPercent: number;
}

const FALLBACK: StoreConfig = {
  freeShippingThresholdCents: 30000,
  maxInstallments: 6,
  pixDiscountPercent: 0,
};

export async function getStoreConfig(): Promise<StoreConfig> {
  try {
    return await apiFetch<StoreConfig>('/b2c/store-config', {
      next: { revalidate: 300 },
    });
  } catch {
    return FALLBACK;
  }
}
