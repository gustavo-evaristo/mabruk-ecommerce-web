import { apiFetch } from '../client';
import type { Product } from '../types';

export async function listMyFavorites(token: string): Promise<Product[]> {
  const res = await apiFetch<{ items: Product[] }>('/b2c/customers/me/favorites', { token });
  return res.items;
}

export async function addFavorite(token: string, productId: string): Promise<void> {
  await apiFetch('/b2c/customers/me/favorites', {
    method: 'POST',
    body: { productId },
    token,
  });
}

export async function removeFavorite(token: string, productId: string): Promise<void> {
  await apiFetch(`/b2c/customers/me/favorites/${productId}`, {
    method: 'DELETE',
    token,
  });
}
