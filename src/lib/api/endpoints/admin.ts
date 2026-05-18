import { apiFetch } from '../client';
import type { OrderStatus, OrderSummary, OrderDetails } from '../types';

export interface AdminDashboard {
  range: { from: string; to: string };
  salesTotalCents: number;
  ordersCount: number;
  averageTicketCents: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  topProducts: {
    variantId: string;
    productId: string;
    productName: string;
    quantity: number;
  }[];
}

export interface AdminOrderSummary extends OrderSummary {
  invoiceNumber?: string | null;
  paymentSummary?: { method: string; installments?: number | null } | null;
}

export interface AdminOrderListResult {
  items: AdminOrderSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminCustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  cpfCnpj: string | null;
  createdAt: string;
}

export interface AdminCustomerListResult {
  items: AdminCustomerSummary[];
  total: number;
}

export async function getAdminDashboard(
  token: string,
  query: { from?: string; to?: string } = {},
): Promise<AdminDashboard> {
  return apiFetch<AdminDashboard>('/b2b/dashboard', { token, query });
}

// ----- Orders -----

export async function listAdminOrders(
  token: string,
  query: {
    status?: OrderStatus;
    search?: string;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<AdminOrderListResult> {
  return apiFetch<AdminOrderListResult>('/b2b/orders', { token, query });
}

export async function getAdminOrder(
  token: string,
  id: string,
): Promise<OrderDetails> {
  return apiFetch<OrderDetails>(`/b2b/orders/${id}`, { token });
}

export async function updateAdminOrderStatus(
  token: string,
  id: string,
  status: OrderStatus,
): Promise<void> {
  await apiFetch(`/b2b/orders/${id}/status`, {
    method: 'PATCH',
    body: { status },
    token,
  });
}

export async function attachAdminInvoice(
  token: string,
  id: string,
  invoiceNumber: string,
): Promise<void> {
  await apiFetch(`/b2b/orders/${id}/invoice`, {
    method: 'PATCH',
    body: { invoiceNumber },
    token,
  });
}

export async function attachAdminShipment(
  token: string,
  id: string,
  body: { trackingCode: string; carrier?: string },
): Promise<void> {
  await apiFetch(`/b2b/orders/${id}/shipment`, {
    method: 'PATCH',
    body,
    token,
  });
}

// ----- Customers -----

export async function listAdminCustomers(
  token: string,
  query: { search?: string; page?: number; pageSize?: number } = {},
): Promise<AdminCustomerListResult> {
  return apiFetch<AdminCustomerListResult>('/b2b/customers', { token, query });
}

export async function getAdminCustomer(
  token: string,
  id: string,
): Promise<AdminCustomerSummary> {
  return apiFetch(`/b2b/customers/${id}`, { token });
}

// ----- Categories -----

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  order: number;
  isActive: boolean;
}

export async function listAdminCategories(token: string): Promise<AdminCategory[]> {
  const res = await apiFetch<{ items: AdminCategory[] }>('/b2b/categories', { token });
  return res.items;
}

export async function createAdminCategory(
  token: string,
  body: { name: string; slug?: string; order?: number; isActive?: boolean },
): Promise<{ id: string; slug: string }> {
  return apiFetch('/b2b/categories', { method: 'POST', body, token });
}

export async function updateAdminCategory(
  token: string,
  id: string,
  body: Partial<{ name: string; slug: string; order: number; isActive: boolean }>,
): Promise<{ id: string; slug: string }> {
  return apiFetch(`/b2b/categories/${id}`, { method: 'PATCH', body, token });
}

export async function deleteAdminCategory(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/categories/${id}`, { method: 'DELETE', token });
}

// ----- Collections -----

export interface AdminCollection {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  order: number;
  isActive: boolean;
}

export async function listAdminCollections(token: string): Promise<AdminCollection[]> {
  const res = await apiFetch<{ items: AdminCollection[] }>('/b2b/collections', { token });
  return res.items;
}

export async function createAdminCollection(
  token: string,
  body: {
    name: string;
    slug?: string;
    description?: string;
    coverImageUrl?: string;
    order?: number;
    isActive?: boolean;
  },
): Promise<{ id: string; slug: string }> {
  return apiFetch('/b2b/collections', { method: 'POST', body, token });
}

export async function updateAdminCollection(
  token: string,
  id: string,
  body: Partial<{
    name: string;
    slug: string;
    description: string;
    coverImageUrl: string;
    order: number;
    isActive: boolean;
  }>,
): Promise<{ id: string; slug: string }> {
  return apiFetch(`/b2b/collections/${id}`, { method: 'PATCH', body, token });
}

export async function deleteAdminCollection(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/collections/${id}`, { method: 'DELETE', token });
}

export async function setCollectionProducts(
  token: string,
  id: string,
  productIds: string[],
): Promise<void> {
  await apiFetch(`/b2b/collections/${id}/products`, {
    method: 'POST',
    body: { productIds },
    token,
  });
}

// ----- Banners -----

export interface AdminBanner {
  id: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  alt: string | null;
  order: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export async function listAdminBanners(token: string): Promise<AdminBanner[]> {
  const res = await apiFetch<{ items: AdminBanner[] }>('/b2b/banners', { token });
  return res.items;
}

export async function createAdminBanner(
  token: string,
  body: Omit<AdminBanner, 'id'>,
): Promise<{ id: string }> {
  return apiFetch('/b2b/banners', { method: 'POST', body, token });
}

export async function updateAdminBanner(
  token: string,
  id: string,
  body: Partial<Omit<AdminBanner, 'id'>>,
): Promise<{ id: string }> {
  return apiFetch(`/b2b/banners/${id}`, { method: 'PATCH', body, token });
}

export async function deleteAdminBanner(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/banners/${id}`, { method: 'DELETE', token });
}

// ----- Products (admin) -----

export interface AdminProductSummary {
  id: string;
  slug: string;
  name: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  basePriceCents: number;
  priceFromCents: number;
  totalStock: number;
  category: { slug: string; name: string };
  imageUrl: string | null;
}

export async function listAdminProducts(
  token: string,
  query: { search?: string; status?: string; page?: number; pageSize?: number } = {},
): Promise<{ items: AdminProductSummary[]; total: number }> {
  return apiFetch('/b2b/products', { token, query });
}

export async function getAdminProduct(token: string, id: string): Promise<unknown> {
  return apiFetch(`/b2b/products/${id}`, { token });
}

export async function createAdminProduct(
  token: string,
  body: Record<string, unknown>,
): Promise<{ id: string; slug: string }> {
  return apiFetch('/b2b/products', { method: 'POST', body, token });
}

export async function updateAdminProduct(
  token: string,
  id: string,
  body: Record<string, unknown>,
): Promise<{ id: string }> {
  return apiFetch(`/b2b/products/${id}`, { method: 'PATCH', body, token });
}

export async function deleteAdminProduct(token: string, id: string): Promise<void> {
  await apiFetch(`/b2b/products/${id}`, { method: 'DELETE', token });
}
