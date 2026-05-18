'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/client';
import {
  createAdminCategory,
  createAdminCollection,
  createAdminBanner,
  deleteAdminCategory,
  deleteAdminCollection,
  deleteAdminBanner,
  updateAdminCategory,
  updateAdminCollection,
  updateAdminBanner,
} from '@/lib/api/endpoints/admin';
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

// --------- Categories ---------

export async function createCategoryAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  if (!name) return { error: 'Nome obrigatório.' };

  try {
    await createAdminCategory(token, { name, slug });
  } catch (err) {
    return { error: msg(err, 'Erro ao criar categoria.') };
  }
  revalidatePath('/admin/categorias');
  revalidatePath('/admin/colecoes');
  return { ok: true };
}

export async function updateCategoryAction(
  id: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim();
  const isActive = formData.get('isActive') === 'on';

  try {
    await updateAdminCategory(token, id, {
      name: name || undefined,
      slug: slug || undefined,
      isActive,
    });
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar.') };
  }
  revalidatePath('/admin/categorias');
  return { ok: true };
}

export async function deleteCategoryAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminCategory(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/categorias');
}

// --------- Collections ---------

export async function saveCollectionAction(
  id: string | null,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  const description = String(formData.get('description') ?? '').trim() || undefined;
  const coverImageUrl = String(formData.get('coverImageUrl') ?? '').trim() || undefined;
  const isActive = formData.get('isActive') === 'on';

  if (!name) return { error: 'Nome obrigatório.' };

  try {
    if (id) {
      await updateAdminCollection(token, id, { name, slug, description, coverImageUrl, isActive });
    } else {
      await createAdminCollection(token, { name, slug, description, coverImageUrl, isActive });
    }
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar coleção.') };
  }
  revalidatePath('/admin/colecoes');
  return { ok: true };
}

export async function deleteCollectionAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminCollection(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/colecoes');
}

// --------- Banners ---------

export async function saveBannerAction(
  id: string | null,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const mobileImageUrl = String(formData.get('mobileImageUrl') ?? '').trim() || null;
  const linkUrl = String(formData.get('linkUrl') ?? '').trim() || null;
  const alt = String(formData.get('alt') ?? '').trim() || null;
  const order = Number(formData.get('order') ?? 0);
  const isActive = formData.get('isActive') === 'on';
  const startsAt = String(formData.get('startsAt') ?? '').trim() || null;
  const endsAt = String(formData.get('endsAt') ?? '').trim() || null;

  if (!imageUrl) return { error: 'URL da imagem desktop é obrigatória.' };

  try {
    if (id) {
      await updateAdminBanner(token, id, {
        imageUrl,
        mobileImageUrl,
        linkUrl,
        alt,
        order,
        isActive,
        startsAt,
        endsAt,
      });
    } else {
      await createAdminBanner(token, {
        imageUrl,
        mobileImageUrl,
        linkUrl,
        alt,
        order,
        isActive,
        startsAt,
        endsAt,
      });
    }
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar banner.') };
  }
  revalidatePath('/admin/banners');
  return { ok: true };
}

export async function deleteBannerAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminBanner(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/banners');
}
