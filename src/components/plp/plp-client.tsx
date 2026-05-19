'use client';

import { useState } from 'react';
import { useProducts } from '@/lib/hooks';
import { FilterSidebar } from './filter-sidebar';
import { FilterDrawer } from './filter-drawer';
import { CategoryView } from './category-view';
import type {
  Category,
  Collection,
  ProductListFilters,
  ProductListResult,
  Tag,
} from '@/lib/api/types';

interface Props {
  categorySlug: string;
  categories: Category[];
  collections: Collection[];
  tags: Tag[];
  initialResult: ProductListResult;
}

export interface PLPFilters {
  /** Mapa de filtros por atributo: { 'cor': Set(['azul','vermelho']), 'banho': Set(['ouro-18k']) } */
  attributes: Record<string, Set<string>>;
  collectionSlug: string | null;
  tagSlug: string | null;
  inStock: boolean;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'name_asc';
}

export function PLPClient({
  categorySlug,
  categories,
  collections,
  tags,
  initialResult,
}: Props) {
  const [filters, setFilters] = useState<PLPFilters>({
    attributes: {},
    collectionSlug: null,
    tagSlug: null,
    inStock: false,
    sort: 'newest',
  });

  const attributeFilters: Record<string, string[]> = {};
  for (const [slug, values] of Object.entries(filters.attributes)) {
    if (values.size > 0) attributeFilters[slug] = Array.from(values);
  }

  const query: ProductListFilters = {
    category: categorySlug,
    collection: filters.collectionSlug ?? undefined,
    tag: filters.tagSlug ?? undefined,
    attributeFilters: Object.keys(attributeFilters).length ? attributeFilters : undefined,
    inStock: filters.inStock || undefined,
    sort: filters.sort,
    pageSize: 30,
  };

  const isDefault =
    Object.keys(attributeFilters).length === 0 &&
    !filters.collectionSlug &&
    !filters.tagSlug &&
    !filters.inStock &&
    filters.sort === 'newest';

  const { data, isFetching } = useProducts(query, {
    initialData: isDefault ? initialResult : undefined,
    placeholderData: (prev) => prev,
  });

  const result = data ?? initialResult;

  return (
    <>
      <div className="lg:hidden">
        <FilterDrawer
          categories={categories}
          collections={collections}
          tags={tags}
          activeCategorySlug={categorySlug}
          availableAttributes={result.availableAttributes}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      <div className="hidden lg:block">
        <FilterSidebar
          categories={categories}
          collections={collections}
          tags={tags}
          activeCategorySlug={categorySlug}
          availableAttributes={result.availableAttributes}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      <CategoryView
        products={result.items}
        total={result.total}
        totalPages={result.totalPages}
        isFetching={isFetching}
        sort={filters.sort}
        onSortChange={(sort) => setFilters((f) => ({ ...f, sort }))}
      />
    </>
  );
}
