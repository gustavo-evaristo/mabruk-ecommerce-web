import { apiFetch, useMock } from '../client';
import type { Collection, CollectionDetails } from '../types';
import { MOCK_COLLECTIONS } from '@/lib/mock/collections';
import { listProducts } from './products';

export async function listCollections(): Promise<Collection[]> {
  if (useMock()) return MOCK_COLLECTIONS;
  const res = await apiFetch<{ items: Collection[] }>('/b2c/collections', {
    next: { revalidate: 300 },
  });
  return res.items;
}

export async function getCollectionBySlug(
  slug: string,
  page = 1,
  pageSize = 20,
): Promise<CollectionDetails | null> {
  if (useMock()) {
    const collection = MOCK_COLLECTIONS.find((c) => c.slug === slug);
    if (!collection) return null;
    const products = await listProducts({ collection: slug, page, pageSize });
    return { collection, products };
  }

  try {
    return await apiFetch<CollectionDetails>(`/b2c/collections/${slug}`, {
      query: { page, pageSize },
      next: { revalidate: 60 },
    });
  } catch {
    return null;
  }
}
