'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/client';
import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
} from '@/lib/api/endpoints/admin';
import { apiFetch } from '@/lib/api/client';
import { getAdminToken } from './admin-session';

export interface ActionState {
  error?: string;
  ok?: boolean;
  id?: string;
}

function msg(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

// --------- Product ---------

export async function saveProductAction(
  id: string | null,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const name = String(formData.get('name') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || undefined;
  const description = String(formData.get('description') ?? '').trim() || undefined;
  const status = String(formData.get('status') ?? 'DRAFT') as 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  const categoryId = String(formData.get('categoryId') ?? '').trim();
  const basePriceCents = Number(formData.get('basePriceCents') ?? 0);
  const weightInGrams = formData.get('weightInGrams')
    ? Number(formData.get('weightInGrams'))
    : undefined;
  const seoTitle = String(formData.get('seoTitle') ?? '').trim() || undefined;
  const seoDescription = String(formData.get('seoDescription') ?? '').trim() || undefined;

  if (!name) return { error: 'Nome obrigatório.' };
  if (!id && !categoryId) return { error: 'Categoria obrigatória.' };
  if (!id && (!basePriceCents || basePriceCents < 0)) {
    return { error: 'Preço base obrigatório (em centavos).' };
  }

  try {
    const body: Record<string, unknown> = {
      name,
      slug,
      description,
      status,
      seoTitle,
      seoDescription,
    };
    if (categoryId) body.categoryId = categoryId;
    if (basePriceCents) body.basePriceCents = basePriceCents;
    if (weightInGrams !== undefined) body.weightInGrams = weightInGrams;

    if (id) {
      await updateAdminProduct(token, id, body);
    } else {
      const result = await createAdminProduct(token, body);
      revalidatePath('/admin/produtos');
      return { ok: true, id: result.id };
    }
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar produto.') };
  }
  revalidatePath('/admin/produtos');
  if (id) revalidatePath(`/admin/produtos/${id}/editar`);
  return { ok: true, id: id ?? undefined };
}

export async function deleteProductAction(id: string): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await deleteAdminProduct(token, id);
  } catch {
    /* engole */
  }
  revalidatePath('/admin/produtos');
}

// --------- Variants ---------

export async function createVariantAction(
  productId: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const sku = String(formData.get('sku') ?? '').trim();
  const banho = String(formData.get('banho') ?? '').trim();
  const size = String(formData.get('size') ?? '').trim();
  const priceCents = Number(formData.get('priceCents') ?? 0);
  const stock = Number(formData.get('stock') ?? 0);

  if (!sku || !banho || !size || priceCents <= 0) {
    return { error: 'Preencha SKU, banho, tamanho e preço.' };
  }

  try {
    await apiFetch(`/b2b/products/${productId}/variants`, {
      method: 'POST',
      body: { sku, banho, size, priceCents, stock },
      token,
    });
  } catch (err) {
    return { error: msg(err, 'Erro ao criar variante.') };
  }
  revalidatePath(`/admin/produtos/${productId}/editar`);
  return { ok: true };
}

export async function deleteVariantAction(
  productId: string,
  variantId: string,
): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await apiFetch(`/b2b/products/${productId}/variants/${variantId}`, {
      method: 'DELETE',
      token,
    });
  } catch {
    /* engole */
  }
  revalidatePath(`/admin/produtos/${productId}/editar`);
}

export async function adjustStockAction(
  productId: string,
  variantId: string,
  delta: number,
): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await apiFetch(`/b2b/products/${productId}/variants/${variantId}/stock`, {
      method: 'POST',
      body: { delta, reason: delta > 0 ? 'MANUAL_IN' : 'MANUAL_OUT' },
      token,
    });
  } catch {
    /* engole */
  }
  revalidatePath(`/admin/produtos/${productId}/editar`);
}

// --------- Images ---------

export async function uploadProductImageAction(
  productId: string,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const file = formData.get('file');
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: 'Selecione uma imagem.' };
  }

  // Reconstrói FormData só com o file (alt é opcional)
  const fd = new FormData();
  fd.set('file', file);
  const alt = String(formData.get('alt') ?? '').trim();
  if (alt) fd.set('alt', alt);

  try {
    await apiFetch(`/b2b/products/${productId}/images`, {
      method: 'POST',
      body: fd,
      token,
    });
  } catch (err) {
    return { error: msg(err, 'Erro ao subir imagem.') };
  }
  revalidatePath(`/admin/produtos/${productId}/editar`);
  return { ok: true };
}

export async function deleteProductImageAction(
  productId: string,
  imageId: string,
): Promise<void> {
  const token = await getAdminToken();
  if (!token) return;
  try {
    await apiFetch(`/b2b/products/${productId}/images/${imageId}`, {
      method: 'DELETE',
      token,
    });
  } catch {
    /* engole */
  }
  revalidatePath(`/admin/produtos/${productId}/editar`);
}
