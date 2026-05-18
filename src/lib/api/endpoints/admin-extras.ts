import { apiFetch } from '../client';

// ----- Promotions -----

export type PromotionType = 'CAMPAIGN' | 'COUPON' | 'RULE';
export type DiscountType = 'PERCENT' | 'FIXED_CENTS' | 'FREE_SHIPPING';
export type PromotionStatus = 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'PAUSED';

export interface AdminPromotion {
  id: string;
  type: PromotionType;
  name: string;
  code: string | null;
  description: string | null;
  discountType: DiscountType;
  discountValue: number;
  scope: string | null;
  usesMax: number | null;
  usesCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  status: PromotionStatus;
  createdAt: string;
}

export async function listAdminPromotions(
  token: string,
  type?: PromotionType,
): Promise<AdminPromotion[]> {
  const res = await apiFetch<{ items: AdminPromotion[] }>('/b2b/promotions', {
    token,
    query: { type },
  });
  return res.items;
}

export async function createAdminPromotion(
  token: string,
  body: Omit<AdminPromotion, 'id' | 'usesCount' | 'createdAt'>,
): Promise<AdminPromotion> {
  return apiFetch('/b2b/promotions', { method: 'POST', body, token });
}

export async function updateAdminPromotion(
  token: string,
  id: string,
  body: Partial<Omit<AdminPromotion, 'id' | 'usesCount' | 'createdAt'>>,
): Promise<AdminPromotion> {
  return apiFetch(`/b2b/promotions/${id}`, { method: 'PATCH', body, token });
}

export async function deleteAdminPromotion(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/promotions/${id}`, { method: 'DELETE', token });
}

// ----- Landings -----

export interface AdminLanding {
  id: string;
  slug: string;
  name: string;
  blocks: { id: string; type: string; props: Record<string, unknown> }[];
  seoTitle: string | null;
  seoDescription: string | null;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}

export async function listAdminLandings(token: string): Promise<AdminLanding[]> {
  const res = await apiFetch<{ items: AdminLanding[] }>('/b2b/landings', { token });
  return res.items;
}

export async function getAdminLanding(token: string, id: string): Promise<AdminLanding> {
  return apiFetch<AdminLanding>(`/b2b/landings/${id}`, { token });
}

export async function createAdminLanding(
  token: string,
  body: {
    name: string;
    slug?: string;
    blocks?: AdminLanding['blocks'];
    seoTitle?: string;
    seoDescription?: string;
    status?: AdminLanding['status'];
  },
): Promise<AdminLanding> {
  return apiFetch('/b2b/landings', { method: 'POST', body, token });
}

export async function updateAdminLanding(
  token: string,
  id: string,
  body: Partial<{
    name: string;
    slug: string;
    blocks: AdminLanding['blocks'];
    seoTitle: string;
    seoDescription: string;
    status: AdminLanding['status'];
  }>,
): Promise<AdminLanding> {
  return apiFetch(`/b2b/landings/${id}`, { method: 'PATCH', body, token });
}

export async function deleteAdminLanding(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/landings/${id}`, { method: 'DELETE', token });
}

// ----- Settings -----

export type SettingsGroup = Record<string, unknown>;
export type AllSettings = Record<string, SettingsGroup>;

export async function getAllSettings(token: string): Promise<AllSettings> {
  return apiFetch<AllSettings>('/b2b/settings', { token });
}

export async function getSettingsByGroup(
  token: string,
  group: string,
): Promise<SettingsGroup> {
  return apiFetch<SettingsGroup>(`/b2b/settings/${group}`, { token });
}

export async function updateSettingsGroup(
  token: string,
  group: string,
  values: SettingsGroup,
): Promise<void> {
  await apiFetch(`/b2b/settings/${group}`, {
    method: 'PATCH',
    body: values,
    token,
  });
}

// ----- Reviews -----

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminReview {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
}

export async function listAdminReviews(
  token: string,
  status?: ReviewStatus,
): Promise<AdminReview[]> {
  const res = await apiFetch<{ items: AdminReview[] }>('/b2b/reviews', {
    token,
    query: { status },
  });
  return res.items;
}

export async function approveAdminReview(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/reviews/${id}/approve`, { method: 'PATCH', token });
}

export async function rejectAdminReview(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/reviews/${id}/reject`, { method: 'PATCH', token });
}

export async function deleteAdminReview(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/reviews/${id}`, { method: 'DELETE', token });
}
