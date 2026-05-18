'use client';

import { useState } from 'react';
import { useProducts } from '@/lib/hooks';
import { FilterSidebar } from './filter-sidebar';
import { FilterDrawer } from './filter-drawer';
import { CategoryView } from './category-view';
import type {
  Banho,
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
  banhos: Set<Banho>;
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
    banhos: new Set(),
    collectionSlug: null,
    tagSlug: null,
    inStock: false,
    sort: 'newest',
  });

  const banhosArr = Array.from(filters.banhos);
  const query: ProductListFilters = {
    category: categorySlug,
    collection: filters.collectionSlug ?? undefined,
    tag: filters.tagSlug ?? undefined,
    banho: banhosArr.length === 1 ? banhosArr[0] : undefined,
    inStock: filters.inStock || undefined,
    sort: filters.sort,
    pageSize: 30,
  };

  const isDefault =
    filters.banhos.size === 0 &&
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
