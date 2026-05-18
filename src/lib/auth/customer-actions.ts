'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/client';
import { updateCustomerMe } from '@/lib/api/endpoints/customers';
import {
  createMyAddress,
  deleteMyAddress,
  updateMyAddress,
} from '@/lib/api/endpoints/customers';
import { addFavorite, removeFavorite } from '@/lib/api/endpoints/favorites';
import { getAuthToken } from './session';

export interface FormState {
  error?: string;
  ok?: boolean;
}

function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

// --------- Perfil ---------

export async function updateProfileAction(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const token = await getAuthToken();
  if (!token) return { error: 'Sessão expirada.' };

  const name = String(formData.get('name') ?? '').trim() || undefined;
  const phone = String(formData.get('phone') ?? '').trim() || undefined;
  const cpfCnpj = String(formData.get('cpfCnpj') ?? '').trim() || undefined;

  try {
    await updateCustomerMe(token, { name, phone, cpfCnpj });
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível salvar.') };
  }

  revalidatePath('/conta');
  revalidatePath('/conta/dados');
  return { ok: true };
}

// --------- Endereços ---------

function readAddressForm(formData: FormData) {
  return {
    label: String(formData.get('label') ?? '').trim() || null,
    recipient: String(formData.get('recipient') ?? '').trim(),
    zipCode: String(formData.get('zipCode') ?? '').replace(/\D/g, ''),
    street: String(formData.get('street') ?? '').trim(),
    number: String(formData.get('number') ?? '').trim(),
    complement: String(formData.get('complement') ?? '').trim() || null,
    neighborhood: String(formData.get('neighborhood') ?? '').trim(),
    city: String(formData.get('city') ?? '').trim(),
    state: String(formData.get('state') ?? '').trim().toUpperCase(),
    isDefault: formData.get('isDefault') === 'on',
  };
}

export async function createAddressAction(
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const token = await getAuthToken();
  if (!token) return { error: 'Sessão expirada.' };

  const body = readAddressForm(formData);
  if (!body.recipient || !body.zipCode || !body.street || !body.number || !body.city || !body.state) {
    return { error: 'Preencha todos os campos obrigatórios.' };
  }

  try {
    await createMyAddress(token, body);
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível cadastrar o endereço.') };
  }

  revalidatePath('/conta/enderecos');
  return { ok: true };
}

export async function updateAddressAction(
  id: string,
  _prev: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const token = await getAuthToken();
  if (!token) return { error: 'Sessão expirada.' };

  try {
    await updateMyAddress(token, id, readAddressForm(formData));
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível atualizar o endereço.') };
  }

  revalidatePath('/conta/enderecos');
  return { ok: true };
}

export async function deleteAddressAction(id: string): Promise<void> {
  const token = await getAuthToken();
  if (!token) return;
  try {
    await deleteMyAddress(token, id);
  } catch {
    /* engole — UI mostrará a lista atual */
  }
  revalidatePath('/conta/enderecos');
}

// --------- Favoritos ---------

export async function toggleFavoriteAction(
  productId: string,
  isCurrentlyFavorite: boolean,
): Promise<{ ok: boolean; isFavorite: boolean; authRequired?: boolean }> {
  const token = await getAuthToken();
  if (!token) return { ok: false, isFavorite: isCurrentlyFavorite, authRequired: true };

  try {
    if (isCurrentlyFavorite) {
      await removeFavorite(token, productId);
    } else {
      await addFavorite(token, productId);
    }
  } catch {
    return { ok: false, isFavorite: isCurrentlyFavorite };
  }

  revalidatePath('/conta/favoritos');
  return { ok: true, isFavorite: !isCurrentlyFavorite };
}
