import { apiFetch, ApiError } from '../client';
import type {
  Product,
  ProductDetails,
  ProductListFilters,
  ProductListResult,
} from '../types';

export async function listProducts(
  filters: ProductListFilters = {},
): Promise<ProductListResult> {
  return apiFetch<ProductListResult>('/b2c/products', {
    query: {
      search: filters.search,
      category: filters.category,
      collection: filters.collection,
      tag: filters.tag,
      banho: filters.banho,
      minPriceCents: filters.minPriceCents,
      maxPriceCents: filters.maxPriceCents,
      inStock: filters.inStock,
      sort: filters.sort,
      page: filters.page,
      pageSize: filters.pageSize,
    },
    next: { revalidate: 60 },
  });
}

export async function getProductBySlug(slug: string): Promise<ProductDetails | null> {
  try {
    return await apiFetch<ProductDetails>(`/b2c/products/${slug}`, {
      next: { revalidate: 60 },
    });
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }
}

export async function listRelatedProducts(slug: string): Promise<Product[]> {
  const res = await apiFetch<{ items: Product[] }>(`/b2c/products/${slug}/related`, {
    next: { revalidate: 60 },
  });
  return res.items;
}

export async function listFeaturedProducts(): Promise<Product[]> {
  const res = await apiFetch<{ items: Product[] }>('/b2c/featured', {
    next: { revalidate: 300 },
  });
  return res.items;
}
