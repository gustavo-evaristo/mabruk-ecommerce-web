import { apiFetch, useMock } from '../client';
import type { Tag } from '../types';
import { MOCK_TAGS } from '@/lib/mock/tags';

export async function listTags(): Promise<Tag[]> {
  if (useMock()) return MOCK_TAGS;
  const res = await apiFetch<{ items: Tag[] }>('/b2c/tags', {
    next: { revalidate: 300 },
  });
  return res.items;
}
