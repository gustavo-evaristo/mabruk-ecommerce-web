import { apiFetch, ApiError } from '../client';
import type { Collection, CollectionDetails } from '../types';

export async function listCollections(): Promise<Collection[]> {
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
  try {
    return await apiFetch<CollectionDetails>(`/b2c/collections/${slug}`, {
      query: { page, pageSize },
      next: { revalidate: 60 },
    });
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }
}
