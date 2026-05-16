import { apiFetch } from '../client';
import type { OrderDetails, OrderSummary } from '../types';

export async function listMyOrders(
  token: string,
  query: { page?: number; pageSize?: number } = {},
): Promise<{ items: OrderSummary[]; total: number }> {
  return apiFetch('/b2c/orders/me', { token, query });
}

export async function getMyOrderByNumber(token: string, number: string): Promise<OrderDetails> {
  return apiFetch<OrderDetails>(`/b2c/orders/me/${number}`, { token });
}

export async function trackOrder(
  number: string,
  email: string,
): Promise<{
  number: string;
  status: string;
  shipment: OrderDetails['shipment'];
}> {
  return apiFetch(`/b2c/orders/${number}/track`, { query: { email } });
}
