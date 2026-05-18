'use server';

import { revalidatePath } from 'next/cache';
import { ApiError } from '@/lib/api/client';
import {
  attachAdminInvoice,
  attachAdminShipment,
  updateAdminOrderStatus,
} from '@/lib/api/endpoints/admin';
import { getAdminToken } from './admin-session';
import type { OrderStatus } from '@/lib/api/types';

export interface OrderActionState {
  error?: string;
  ok?: boolean;
}

function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
): Promise<OrderActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  try {
    await updateAdminOrderStatus(token, orderId, status);
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível atualizar o status.') };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');
  return { ok: true };
}

export async function attachInvoiceAction(
  orderId: string,
  _prev: OrderActionState | undefined,
  formData: FormData,
): Promise<OrderActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const invoiceNumber = String(formData.get('invoiceNumber') ?? '').trim();
  if (!invoiceNumber) return { error: 'Informe o número da NF.' };

  try {
    await attachAdminInvoice(token, orderId, invoiceNumber);
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível anexar a NF.') };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  return { ok: true };
}

export async function attachTrackingAction(
  orderId: string,
  _prev: OrderActionState | undefined,
  formData: FormData,
): Promise<OrderActionState> {
  const token = await getAdminToken();
  if (!token) return { error: 'Sessão expirada.' };

  const trackingCode = String(formData.get('trackingCode') ?? '').trim();
  const carrier = String(formData.get('carrier') ?? '').trim() || undefined;
  if (!trackingCode) return { error: 'Informe o código de rastreio.' };

  try {
    await attachAdminShipment(token, orderId, { trackingCode, carrier });
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível anexar o rastreio.') };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  return { ok: true };
}
