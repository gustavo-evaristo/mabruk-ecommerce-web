import { apiFetch } from '../client';
import type { CardIntent, PixIntent } from '../types';

export async function createPixPayment(orderId: string): Promise<PixIntent> {
  return apiFetch<PixIntent>(`/b2c/payments/${orderId}/pix`, { method: 'POST', body: {} });
}

export async function createCardPayment(
  orderId: string,
  body: { cardToken: string; installments: number },
): Promise<CardIntent> {
  return apiFetch<CardIntent>(`/b2c/payments/${orderId}/card`, { method: 'POST', body });
}
