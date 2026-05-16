import { apiFetch, useMock } from '../client';
import type { Category } from '../types';
import { MOCK_CATEGORIES } from '@/lib/mock/categories';

export async function listCategories(): Promise<Category[]> {
  if (useMock()) return MOCK_CATEGORIES;
  const res = await apiFetch<{ items: Category[] }>('/b2c/categories', {
    next: { revalidate: 300 },
  });
  return res.items;
}
