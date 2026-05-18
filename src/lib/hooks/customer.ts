'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import {
  getCustomerMe,
  listMyAddresses,
} from '@/lib/api/endpoints/customers';
import { listMyOrders, getMyOrderByNumber } from '@/lib/api/endpoints/orders';
import { listMyFavorites } from '@/lib/api/endpoints/favorites';
import type {
  Address,
  Customer,
  OrderDetails,
  OrderSummary,
  Product,
} from '@/lib/api/types';

/**
 * Hooks de leitura para a área logada do cliente. Recebem o JWT como argumento.
 * Mutations vão por Server Actions (mais simples + revalidatePath).
 */

type Options<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

export function useCustomerMe(token: string, opts?: Options<Customer>) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => getCustomerMe(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useMyAddresses(token: string, opts?: Options<Address[]>) {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: () => listMyAddresses(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useMyOrders(
  token: string,
  query: { page?: number; pageSize?: number } = {},
  opts?: Options<{ items: OrderSummary[]; total: number }>,
) {
  return useQuery({
    queryKey: [...queryKeys.myOrders, query],
    queryFn: () => listMyOrders(token, query),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useMyOrder(token: string, number: string, opts?: Options<OrderDetails>) {
  return useQuery({
    queryKey: queryKeys.myOrder(number),
    queryFn: () => getMyOrderByNumber(token, number),
    enabled: Boolean(token && number),
    ...opts,
  });
}

export function useMyFavorites(token: string, opts?: Options<Product[]>) {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: () => listMyFavorites(token),
    enabled: Boolean(token),
    ...opts,
  });
}
