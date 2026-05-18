import { apiFetch } from '../client';
import type { Banner } from '../types';

export async function listBanners(): Promise<Banner[]> {
  const res = await apiFetch<{ items: Banner[] }>('/b2c/banners', {
    next: { revalidate: 300 },
  });
  return res.items;
}
