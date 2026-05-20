'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/client';
import {
  createAdminProduct,
  deleteAdminProduct,
  generateAdminProductVariants,
  hardDeleteAdminProduct,
  restoreAdminProduct,
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
  const type = (String(formData.get('type') ?? 'SIMPLE') as 'SIMPLE' | 'VARIABLE') || 'SIMPLE';
  const categoryId = String(formData.get('categoryId') ?? '').trim();
  const weightInGrams = formData.get('weightInGrams')
    ? Number(formData.get('weightInGrams'))
    : undefined;
  const seoTitle = String(formData.get('seoTitle') ?? '').trim() || undefined;
  const seoDescription = String(formData.get('seoDescription') ?? '').trim() || undefined;
  const tagIds = formData
    .getAll('tagIds')
    .map((v) => String(v))
    .filter((v) => v.length > 0);
  const attributeIds = formData
    .getAll('attributeIds')
    .map((v) => String(v))
    .filter((v) => v.length > 0);

  // Campos SIMPLE
  const sku = String(formData.get('sku') ?? '').trim() || undefined;
  const priceCents = formData.get('priceCents')
    ? Number(formData.get('priceCents'))
    : undefined;
  const stock = formData.get('stock') ? Number(formData.get('stock')) : undefined;

  // basePrice: vem do form em VARIABLE; em SIMPLE espelha o priceCents
  const basePriceCents =
    type === 'SIMPLE'
      ? priceCents ?? 0
      : Number(formData.get('basePriceCents') ?? 0);

  if (!name) return { error: 'Nome obrigatório.' };
  if (!id && !categoryId) return { error: 'Categoria obrigatória.' };
  if (!id && type === 'VARIABLE' && (!basePriceCents || basePriceCents < 0)) {
    return { error: 'Preço base obrigatório.' };
  }
  if (!id && type === 'SIMPLE' && (!sku || !priceCents)) {
    return { error: 'Produto simples precisa de SKU e preço.' };
  }
  if (!id && type === 'VARIABLE' && attributeIds.length === 0) {
    return { error: 'Produto variável precisa de ao menos um atributo.' };
  }

  try {
    const body: Record<string, unknown> = {
      name,
      slug,
      description,
      status,
      type,
      seoTitle,
      seoDescription,
      tagIds,
    };
    if (categoryId) body.categoryId = categoryId;
    if (basePriceCents) body.basePriceCents = basePriceCents;
    if (weightInGrams !== undefined) body.weightInGrams = weightInGrams;
    if (sku) body.sku = sku;
    if (priceCents) body.priceCents = priceCents;
    if (stock !== undefined) body.stock = stock;
    if (type === 'VARIABLE' && attributeIds.length > 0) body.attributeIds = attributeIds;

    if (id) {
      await updateAdminProduct(token, id, body);
    } else {
      const result = await createAdminProduct(token, body);

      // Cria variantes iniciais (apenas VARIABLE) cadastradas no form
      // Mapa SKU → variantId pra usar no upload de fotos
      const variantIdBySku: Record<string, string> = {};
      if (type === 'VARIABLE') {
        const rawInitial = String(formData.get('initialVariants') ?? '[]');
        let initialVariants: Array<{
          sku: string;
          values: Record<string, string>;
          priceCents: number;
          stock: number;
        }> = [];
        try {
          const parsed = JSON.parse(rawInitial);
          if (Array.isArray(parsed)) initialVariants = parsed;
        } catch {
          /* payload inválido */
        }
        for (const v of initialVariants) {
          if (!v.sku?.trim()) continue;
          const attributeValueIds = Object.values(v.values).filter(Boolean);
          if (attributeValueIds.length === 0) continue;
          const finalPrice = v.priceCents > 0 ? v.priceCents : basePriceCents;
          if (!(finalPrice > 0)) continue;
          try {
            const created = await apiFetch<{ id: string; sku: string }>(
              `/b2b/products/${result.id}/variants`,
              {
                method: 'POST',
                body: {
                  sku: v.sku.trim(),
                  attributeValueIds,
                  priceCents: finalPrice,
                  stock: Math.max(0, Number(v.stock) || 0),
                },
                token,
              },
            );
            variantIdBySku[created.sku] = created.id;
          } catch {
            /* falha individual não bloqueia */
          }
        }
      }

      // Upload imagens anexadas no submit do create (com SKU de variante opcional)
      const photos = formData
        .getAll('photos')
        .filter((v): v is File => v instanceof File && v.size > 0);
      const photoVariantSkus = formData.getAll('photoVariantSkus').map(String);
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const sku = photoVariantSkus[i] ?? '';
        const variantId = sku ? variantIdBySku[sku] : undefined;
        const fd = new FormData();
        fd.set('file', file);
        if (variantId) fd.set('variantId', variantId);
        try {
          await apiFetch(`/b2b/products/${result.id}/images`, {
            method: 'POST',
            body: fd,
            token,
          });
        } catch {
          /* ignora falha individual — produto já existe, user pode subir depois */
        }
      }
      revalidatePath('/admin/produtos');
      revalidatePath(`/admin/produtos/${result.id}/editar`);
      // Invalida rotas B2C que mostram produtos
      revalidatePath('/', 'layout');
      return { ok: true, id: result.id };
    }
  } catch (err) {
    return { error: msg(err, 'Erro ao salvar produto.') };
  }
  revalidatePath('/admin/produtos');
  if (id) revalidatePath(`/admin/produtos/${id}/editar`);
  // Invalida rotas B2C que mostram produtos
  revalidatePath('/', 'layout');
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
  revalidatePath('/admin/produtos/lixeira');
  revalidatePath('/', 'layout');
}

export async function restoreProductAction(id: string): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  try {
    await restoreAdminProduct(token, id);
  } catch (err) {
    return { error: msg(err, 'Erro ao restaurar produto.') };
  }
  revalidatePath('/admin/produtos');
  revalidatePath('/admin/produtos/lixeira');
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function hardDeleteProductAction(id: string): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  try {
    await hardDeleteAdminProduct(token, id);
  } catch (err) {
    return { error: msg(err, 'Erro ao apagar produto.') };
  }
  revalidatePath('/admin/produtos/lixeira');
  revalidatePath('/', 'layout');
  return { ok: true };
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
  const priceCents = Number(formData.get('priceCents') ?? 0);
  const stock = Number(formData.get('stock') ?? 0);
  const attributeValueIds = formData
    .getAll('attributeValueIds')
    .map((v) => String(v))
    .filter((v) => v.length > 0);

  if (!sku || priceCents <= 0 || attributeValueIds.length === 0) {
    return { error: 'Preencha SKU, preço e selecione um valor para cada atributo.' };
  }

  try {
    await apiFetch(`/b2b/products/${productId}/variants`, {
      method: 'POST',
      body: { sku, attributeValueIds, priceCents, stock },
      token,
    });
  } catch (err) {
    return { error: msg(err, 'Erro ao criar variante.') };
  }
  revalidatePath(`/admin/produtos/${productId}/editar`);
  return { ok: true };
}

export async function generateVariantsAction(
  productId: string,
  body: { defaultPriceCents?: number; defaultStock?: number; skuPrefix?: string },
): Promise<ActionState & { created?: number; skipped?: number }> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  try {
    const r = await generateAdminProductVariants(token, productId, body);
    revalidatePath(`/admin/produtos/${productId}/editar`);
    return { ok: true, created: r.created, skipped: r.skipped };
  } catch (err) {
    return { error: msg(err, 'Erro ao gerar variantes.') };
  }
}

export async function reorderProductImagesAction(
  productId: string,
  imageIds: string[],
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  try {
    await apiFetch(`/b2b/products/${productId}/images/reorder`, {
      method: 'PATCH',
      body: { imageIds },
      token,
    });
    revalidatePath(`/admin/produtos/${productId}/editar`);
    return { ok: true };
  } catch (err) {
    return { error: msg(err, 'Erro ao reordenar imagens.') };
  }
}

export async function uploadProductImageWithVariantAction(
  productId: string,
  formData: FormData,
): Promise<ActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };
  const file = formData.get('file');
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: 'Selecione uma imagem.' };
  }
  const fd = new FormData();
  fd.set('file', file);
  const alt = String(formData.get('alt') ?? '').trim();
  if (alt) fd.set('alt', alt);
  const variantId = String(formData.get('variantId') ?? '').trim();
  if (variantId) fd.set('variantId', variantId);
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
