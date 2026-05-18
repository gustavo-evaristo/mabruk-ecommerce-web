import { apiFetch } from '../client';
import type { Category } from '../types';

export async function listCategories(): Promise<Category[]> {
  const res = await apiFetch<{ items: Category[] }>('/b2c/categories', {
    next: { revalidate: 300 },
  });
  return res.items;
}
