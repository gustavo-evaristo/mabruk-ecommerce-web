import { apiFetch } from '../client';
import type { Tag } from '../types';

export async function listTags(): Promise<Tag[]> {
  const res = await apiFetch<{ items: Tag[] }>('/b2c/tags', {
    next: { revalidate: 300 },
  });
  return res.items;
}
