import { apiFetch, useMock } from '../client';
import type {
  Product,
  ProductDetails,
  ProductListFilters,
  ProductListResult,
} from '../types';
import {
  MOCK_PRODUCTS,
  MOCK_PRODUCT_COLLECTIONS,
  MOCK_PRODUCT_TAGS,
  getMockProductDetails,
} from '@/lib/mock/products';

/**
 * Aplica filtros + paginação + ordenação no array de mocks.
 * Replica a lógica do `IProductRepository.list` na API.
 */
function applyMockFilters(filters: ProductListFilters): ProductListResult {
  let items = [...MOCK_PRODUCTS];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    items = items.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description ?? '').toLowerCase().includes(q),
    );
  }
  if (filters.category) items = items.filter((p) => p.category.slug === filters.category);
  if (filters.collection) {
    items = items.filter((p) => (MOCK_PRODUCT_COLLECTIONS[p.id] ?? []).includes(filters.collection!));
  }
  if (filters.tag) {
    items = items.filter((p) => (MOCK_PRODUCT_TAGS[p.id] ?? []).includes(filters.tag!));
  }
  if (filters.banho) items = items.filter((p) => p.variants.some((v) => v.banho === filters.banho));
  if (filters.minPriceCents !== undefined) {
    items = items.filter((p) => p.priceToCents >= filters.minPriceCents!);
  }
  if (filters.maxPriceCents !== undefined) {
    items = items.filter((p) => p.priceFromCents <= filters.maxPriceCents!);
  }
  if (filters.inStock) items = items.filter((p) => p.inStock);

  switch (filters.sort) {
    case 'price_asc':
      items.sort((a, b) => a.priceFromCents - b.priceFromCents);
      break;
    case 'price_desc':
      items.sort((a, b) => b.priceFromCents - a.priceFromCents);
      break;
    case 'name_asc':
      items.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
    default:
      // mock não tem createdAt — mantém ordem original
      break;
  }

  const page = filters.page ?? 1;
  const pageSize = Math.min(filters.pageSize ?? 20, 60);
  const total = items.length;
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return { items: paged, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
}

export async function listProducts(filters: ProductListFilters = {}): Promise<ProductListResult> {
  if (useMock()) return applyMockFilters(filters);

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
  if (useMock()) return getMockProductDetails(slug);

  try {
    return await apiFetch<ProductDetails>(`/b2c/products/${slug}`, {
      next: { revalidate: 60 },
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'ApiError' && 'statusCode' in err && err.statusCode === 404) {
      return null;
    }
    throw err;
  }
}

export async function listRelatedProducts(slug: string): Promise<Product[]> {
  if (useMock()) {
    const target = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!target) return [];
    return MOCK_PRODUCTS.filter(
      (p) => p.id !== target.id && p.category.slug === target.category.slug,
    ).slice(0, 8);
  }

  const res = await apiFetch<{ items: Product[] }>(`/b2c/products/${slug}/related`, {
    next: { revalidate: 60 },
  });
  return res.items;
}

export async function listFeaturedProducts(): Promise<Product[]> {
  if (useMock()) {
    return MOCK_PRODUCTS.slice(0, 8);
  }
  const res = await apiFetch<{ items: Product[] }>('/b2c/featured', {
    next: { revalidate: 300 },
  });
  return res.items;
}
