'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import {
  getAdminDashboard,
  listAdminOrders,
  getAdminOrder,
  listAdminCustomers,
  getAdminCustomer,
  listAdminProducts,
  getAdminProduct,
  listAdminCollections,
  listAdminCategories,
  listAdminBanners,
} from '@/lib/api/endpoints/admin';
import {
  listAdminPromotions,
  listAdminLandings,
  getAllSettings,
  listAdminReviews,
  type AdminPromotion,
  type AdminLanding,
  type AdminReview,
  type AllSettings,
  type ReviewStatus,
  type PromotionType,
} from '@/lib/api/endpoints/admin-extras';
import type {
  AdminCategory,
  AdminCollection,
  AdminBanner,
  AdminCustomerSummary,
  AdminCustomerListResult,
  AdminDashboard,
  AdminOrderListResult,
  AdminProductSummary,
} from '@/lib/api/endpoints/admin';
import type { OrderDetails, OrderStatus } from '@/lib/api/types';

/**
 * Hooks de leitura do painel admin. Todos exigem o JWT do admin como argumento.
 * Mutations continuam via Server Actions; aqui são apenas reads.
 */

type Options<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

export function useAdminDashboard(token: string, opts?: Options<AdminDashboard>) {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: () => getAdminDashboard(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminOrders(
  token: string,
  filters: { status?: OrderStatus; search?: string; page?: number; pageSize?: number },
  opts?: Options<AdminOrderListResult>,
) {
  return useQuery({
    queryKey: queryKeys.admin.orders.list(filters),
    queryFn: () => listAdminOrders(token, filters),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminOrder(
  token: string,
  id: string,
  opts?: Options<OrderDetails>,
) {
  return useQuery({
    queryKey: queryKeys.admin.orders.detail(id),
    queryFn: () => getAdminOrder(token, id),
    enabled: Boolean(token && id),
    ...opts,
  });
}

export function useAdminCustomers(
  token: string,
  filters: { search?: string; page?: number; pageSize?: number },
  opts?: Options<AdminCustomerListResult>,
) {
  return useQuery({
    queryKey: queryKeys.admin.customers.list(filters),
    queryFn: () => listAdminCustomers(token, filters),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminCustomer(
  token: string,
  id: string,
  opts?: Options<AdminCustomerSummary>,
) {
  return useQuery({
    queryKey: queryKeys.admin.customers.detail(id),
    queryFn: () => getAdminCustomer(token, id),
    enabled: Boolean(token && id),
    ...opts,
  });
}

export function useAdminProducts(
  token: string,
  filters: { search?: string; status?: string; page?: number; pageSize?: number },
  opts?: Options<{ items: AdminProductSummary[]; total: number }>,
) {
  return useQuery({
    queryKey: queryKeys.admin.products.list(filters),
    queryFn: () => listAdminProducts(token, filters),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminProduct(
  token: string,
  id: string,
  opts?: Options<unknown>,
) {
  return useQuery({
    queryKey: queryKeys.admin.products.detail(id),
    queryFn: () => getAdminProduct(token, id),
    enabled: Boolean(token && id),
    ...opts,
  });
}

export function useAdminCollections(token: string, opts?: Options<AdminCollection[]>) {
  return useQuery({
    queryKey: queryKeys.admin.collections,
    queryFn: () => listAdminCollections(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminCategories(token: string, opts?: Options<AdminCategory[]>) {
  return useQuery({
    queryKey: queryKeys.admin.categories,
    queryFn: () => listAdminCategories(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminBanners(token: string, opts?: Options<AdminBanner[]>) {
  return useQuery({
    queryKey: queryKeys.admin.banners,
    queryFn: () => listAdminBanners(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminPromotions(
  token: string,
  type?: PromotionType,
  opts?: Options<AdminPromotion[]>,
) {
  return useQuery({
    queryKey: queryKeys.admin.promotions(type),
    queryFn: () => listAdminPromotions(token, type),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminLandings(token: string, opts?: Options<AdminLanding[]>) {
  return useQuery({
    queryKey: queryKeys.admin.landings,
    queryFn: () => listAdminLandings(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminSettings(token: string, opts?: Options<AllSettings>) {
  return useQuery({
    queryKey: queryKeys.admin.settings,
    queryFn: () => getAllSettings(token),
    enabled: Boolean(token),
    ...opts,
  });
}

export function useAdminReviews(
  token: string,
  status?: ReviewStatus,
  opts?: Options<AdminReview[]>,
) {
  return useQuery({
    queryKey: queryKeys.admin.reviews(status),
    queryFn: () => listAdminReviews(token, status),
    enabled: Boolean(token),
    ...opts,
  });
}
