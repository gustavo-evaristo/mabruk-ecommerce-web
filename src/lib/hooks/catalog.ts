'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { queryKeys } from './query-keys';
import {
  listCategories,
  listCollections,
  getCollectionBySlug,
  listBanners,
  listTags,
  listProducts,
  listFeaturedProducts,
  getProductBySlug,
  listRelatedProducts,
} from '@/lib/api/endpoints';
import type {
  Category,
  Collection,
  CollectionDetails,
  Banner,
  Tag,
  Product,
  ProductDetails,
  ProductListFilters,
  ProductListResult,
} from '@/lib/api/types';

/**
 * Hooks `use*` para consumir o catálogo a partir de Client Components.
 * Server Components devem continuar usando `apiFetch()` direto via endpoints.
 *
 * Pode receber `initialData` quando o pai server-side já buscou — evita
 * o primeiro loading no client.
 */

type Options<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

export function useCategories(opts?: Options<Category[]>) {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => listCategories(),
    staleTime: 5 * 60_000,
    ...opts,
  });
}

export function useCollections(opts?: Options<Collection[]>) {
  return useQuery({
    queryKey: queryKeys.collections.all,
    queryFn: () => listCollections(),
    staleTime: 5 * 60_000,
    ...opts,
  });
}

export function useCollection(slug: string, opts?: Options<CollectionDetails | null>) {
  return useQuery({
    queryKey: queryKeys.collections.detail(slug),
    queryFn: () => getCollectionBySlug(slug),
    enabled: Boolean(slug),
    ...opts,
  });
}

export function useBanners(opts?: Options<Banner[]>) {
  return useQuery({
    queryKey: queryKeys.banners,
    queryFn: () => listBanners(),
    staleTime: 5 * 60_000,
    ...opts,
  });
}

export function useTags(opts?: Options<Tag[]>) {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: () => listTags(),
    staleTime: 5 * 60_000,
    ...opts,
  });
}

export function useProducts(
  filters: ProductListFilters,
  opts?: Options<ProductListResult>,
) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => listProducts(filters),
    ...opts,
  });
}

export function useFeaturedProducts(opts?: Options<Product[]>) {
  return useQuery({
    queryKey: queryKeys.products.featured,
    queryFn: () => listFeaturedProducts(),
    staleTime: 5 * 60_000,
    ...opts,
  });
}

export function useProduct(slug: string, opts?: Options<ProductDetails | null>) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
    ...opts,
  });
}

export function useRelatedProducts(slug: string, opts?: Options<Product[]>) {
  return useQuery({
    queryKey: queryKeys.products.related(slug),
    queryFn: () => listRelatedProducts(slug),
    enabled: Boolean(slug),
    ...opts,
  });
}
