'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/client';
import {
  createAdminCategory,
  createAdminCollection,
  createAdminBanner,
  createAdminTag,
  createAdminAttribute,
  createAdminAttributeValue,
  deleteAdminCategory,
  deleteAdminCollection,
  deleteAdminBanner,
  deleteAdminTag,
  deleteAdminAttribute,
  deleteAdminAttributeValue,
  updateAdminCategory,
  updateAdminCollection,
  updateAdminBanner,
  updateAdminTag,
  updateAdminAttribute,
  updateAdminAttributeValue,
  uploadAdminCategoryImage,
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
  revalidatePath('/', 'layout');
}

export async function uploadCategoryImageAction(
  id: string,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const file = formData.get('file');
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: 'Selecione uma imagem.' };
  }
  try {
    await uploadAdminCategoryImage(token, id, file);
  } catch (err) {
    return { error: msg(err, 'Erro ao subir imagem.') };
  }
  revalidatePath('/admin/categorias');
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function removeCategoryImageAction(id: string): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  try {
    await updateAdminCategory(token, id, { imageUrl: null });
  } catch (err) {
    return { error: msg(err, 'Erro ao remover imagem.') };
  }
  revalidatePath('/admin/categorias');
  revalidatePath('/', 'layout');
  return { ok: true };
}

// --------- Tags ---------

export async function saveTagAction(
  id: string | null,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  if (!name) return { error: 'Nome obrigatório.' };
  try {
    if (id) await updateAdminTag(token, id, { name, slug });
    else await createAdminTag(token, { name, slug });
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar tag.') };
  }
  revalidatePath('/admin/tags');
  return { ok: true };
}

export async function deleteTagAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminTag(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/tags');
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

// --------- Attributes ---------

export async function createAttributeAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  const type = (String(formData.get('type') ?? 'SELECT') as 'SELECT' | 'COLOR') || 'SELECT';
  if (!name) return { error: 'Nome obrigatório.' };
  try {
    await createAdminAttribute(token, { name, slug, type });
  } catch (err) {
    return { error: msg(err, 'Erro ao criar atributo.') };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}

export async function updateAttributeAction(
  id: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  const type = (String(formData.get('type') ?? '') as 'SELECT' | 'COLOR') || undefined;
  if (!name) return { error: 'Nome obrigatório.' };
  try {
    await updateAdminAttribute(token, id, { name, slug, type });
  } catch (err) {
    return { error: msg(err, 'Erro ao atualizar atributo.') };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}

export async function deleteAttributeAction(id: string): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  try {
    await deleteAdminAttribute(token, id);
  } catch (err) {
    return { error: msg(err, 'Erro ao excluir atributo.') };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}

export async function createAttributeValueAction(
  attributeId: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  const hex = String(formData.get('hex') ?? '').trim() || undefined;
  if (!name) return { error: 'Nome obrigatório.' };
  try {
    await createAdminAttributeValue(token, attributeId, { name, slug, hex });
  } catch (err) {
    return { error: msg(err, 'Erro ao criar valor.') };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}

export async function updateAttributeValueAction(
  attributeId: string,
  valueId: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  const hex = String(formData.get('hex') ?? '').trim() || undefined;
  if (!name) return { error: 'Nome obrigatório.' };
  try {
    await updateAdminAttributeValue(token, attributeId, valueId, { name, slug, hex });
  } catch (err) {
    return { error: msg(err, 'Erro ao atualizar valor.') };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}

export async function deleteAttributeValueAction(
  attributeId: string,
  valueId: string,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  try {
    await deleteAdminAttributeValue(token, attributeId, valueId);
  } catch (err) {
    return { error: msg(err, 'Erro ao excluir valor.') };
  }
  revalidatePath('/admin/atributos');
  return { ok: true };
}
