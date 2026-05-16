import { apiFetch, useMock } from '../client';
import type { Banner } from '../types';
import { MOCK_BANNERS } from '@/lib/mock/banners';

export async function listBanners(): Promise<Banner[]> {
  if (useMock()) return MOCK_BANNERS;
  const res = await apiFetch<{ items: Banner[] }>('/b2c/banners', {
    next: { revalidate: 300 },
  });
  return res.items;
}
