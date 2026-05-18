'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/client';
import {
  createAdminPromotion,
  updateAdminPromotion,
  deleteAdminPromotion,
  createAdminLanding,
  updateAdminLanding,
  deleteAdminLanding,
  updateSettingsGroup,
  approveAdminReview,
  rejectAdminReview,
  deleteAdminReview,
  type AdminPromotion,
  type AdminLanding,
} from '@/lib/api/endpoints/admin-extras';
import { getAdminToken } from './admin-session';

export interface ActionState {
  error?: string;
  ok?: boolean;
}

function msg(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

// --------- Promotions ---------

export async function savePromotionAction(
  id: string | null,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const body = {
    type: String(formData.get('type') ?? 'COUPON') as AdminPromotion['type'],
    name: String(formData.get('name') ?? '').trim(),
    code: String(formData.get('code') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    discountType: String(formData.get('discountType') ?? 'PERCENT') as AdminPromotion['discountType'],
    discountValue: Number(formData.get('discountValue') ?? 0),
    scope: String(formData.get('scope') ?? 'all').trim() || 'all',
    usesMax: formData.get('usesMax') ? Number(formData.get('usesMax')) : null,
    startsAt: String(formData.get('startsAt') ?? '').trim() || null,
    expiresAt: String(formData.get('expiresAt') ?? '').trim() || null,
    status: String(formData.get('status') ?? 'ACTIVE') as AdminPromotion['status'],
  };

  if (!body.name) return { error: 'Nome obrigatório.' };
  if (body.discountValue < 0) return { error: 'Desconto inválido.' };

  try {
    if (id) {
      await updateAdminPromotion(token, id, body);
    } else {
      await createAdminPromotion(token, body);
    }
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar promoção.') };
  }
  revalidatePath('/admin/promocoes');
  return { ok: true };
}

export async function deletePromotionAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminPromotion(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/promocoes');
}

// --------- Landings ---------

export async function saveLandingAction(
  id: string | null,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  const blocksJson = String(formData.get('blocks') ?? '[]').trim();
  const seoTitle = String(formData.get('seoTitle') ?? '').trim() || undefined;
  const seoDescription = String(formData.get('seoDescription') ?? '').trim() || undefined;
  const status = String(formData.get('status') ?? 'DRAFT') as AdminLanding['status'];

  if (!name) return { error: 'Nome obrigatório.' };
  let blocks: AdminLanding['blocks'] = [];
  try {
    blocks = JSON.parse(blocksJson);
  } catch {
    return { error: 'JSON de blocks inválido.' };
  }

  try {
    if (id) {
      await updateAdminLanding(token, id, { name, slug, blocks, seoTitle, seoDescription, status });
    } else {
      await createAdminLanding(token, { name, slug, blocks, seoTitle, seoDescription, status });
    }
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar landing.') };
  }
  revalidatePath('/admin/landings');
  return { ok: true };
}

export async function deleteLandingAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminLanding(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/landings');
}

// --------- Settings ---------

export async function saveSettingsGroupAction(
  group: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const values: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      // checkbox vem como "on"; outros vêm como string
      if (value === 'on') values[key] = true;
      else if (value === '') values[key] = '';
      else values[key] = value;
    }
  }

  try {
    await updateSettingsGroup(token, group, values);
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar configurações.') };
  }
  revalidatePath('/admin/configuracoes');
  return { ok: true };
}

// --------- Reviews ---------

export async function approveReviewAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await approveAdminReview(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/avaliacoes');
}

export async function rejectReviewAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await rejectAdminReview(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/avaliacoes');
}

export async function deleteReviewAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminReview(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/avaliacoes');
}
