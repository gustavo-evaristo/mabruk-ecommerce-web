import type { ProductListFilters } from '@/lib/api/types';

/**
 * Chaves de query padronizadas. Permite invalidar grupos inteiros sem
 * adivinhar strings.
 *
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.products.list(filters) })
 */
export const queryKeys = {
  // Catálogo público
  categories: ['categories'] as const,
  collections: {
    all: ['collections'] as const,
    detail: (slug: string) => ['collections', slug] as const,
  },
  tags: ['tags'] as const,
  banners: ['banners'] as const,
  products: {
    all: ['products'] as const,
    list: (filters: ProductListFilters) => ['products', 'list', filters] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
    related: (slug: string) => ['products', 'related', slug] as const,
    featured: ['products', 'featured'] as const,
  },
  cep: (zip: string) => ['cep', zip] as const,
  shipping: (cartId: string, zip: string) =>
    ['shipping', 'quote', cartId, zip] as const,

  // Cliente autenticado
  me: ['customer', 'me'] as const,
  addresses: ['customer', 'addresses'] as const,
  myOrders: ['customer', 'orders'] as const,
  myOrder: (number: string) => ['customer', 'orders', number] as const,
  favorites: ['customer', 'favorites'] as const,

  // Admin
  admin: {
    dashboard: ['admin', 'dashboard'] as const,
    orders: {
      list: (filters: { status?: string; search?: string; page?: number }) =>
        ['admin', 'orders', 'list', filters] as const,
      detail: (id: string) => ['admin', 'orders', id] as const,
    },
    products: {
      list: (filters: { search?: string; status?: string; page?: number }) =>
        ['admin', 'products', 'list', filters] as const,
      detail: (id: string) => ['admin', 'products', id] as const,
    },
    customers: {
      list: (filters: { search?: string }) => ['admin', 'customers', filters] as const,
      detail: (id: string) => ['admin', 'customers', id] as const,
    },
    collections: ['admin', 'collections'] as const,
    banners: ['admin', 'banners'] as const,
    categories: ['admin', 'categories'] as const,
    promotions: (type?: string) => ['admin', 'promotions', type ?? 'all'] as const,
    landings: ['admin', 'landings'] as const,
    settings: ['admin', 'settings'] as const,
    reviews: (status?: string) => ['admin', 'reviews', status ?? 'all'] as const,
  },
} as const;
