'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Product } from '@/lib/api/types';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { ProductCard } from '@/components/product/product-card';
import { formatMoney, installmentValue } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

type View = 'grid' | 'list';
type Sort = 'newest' | 'price_asc' | 'price_desc' | 'name_asc';

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'newest', label: 'Novidades' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name_asc', label: 'Nome (A–Z)' },
];

interface Props {
  products: Product[];
  total: number;
  totalPages: number;
  /** chips de filtros já aplicados (vem da query) — opcional */
  appliedFilters?: string[];
}

export function CategoryView({ products, total, totalPages, appliedFilters = [] }: Props) {
  const [view, setView] = useState<View>('grid');
  const [sort, setSort] = useState<Sort>('newest');
  const [chips, setChips] = useState<string[]>(appliedFilters);

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'price_asc':
        return list.sort((a, b) => a.priceFromCents - b.priceFromCents);
      case 'price_desc':
        return list.sort((a, b) => b.priceFromCents - a.priceFromCents);
      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, sort]);

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-end gap-3 border-b border-line py-3.5 lg:-mt-12 lg:gap-6">
        <div className="flex items-center gap-2 text-eyebrow font-medium uppercase">
          <span className="text-ink-60">Ordenar</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="!w-auto !border-0 !p-0 text-body-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex border border-line">
          <button
            type="button"
            aria-label="Visualização em grade"
            onClick={() => setView('grid')}
            className={cn(
              'grid size-9 cursor-pointer place-items-center transition-colors',
              view === 'grid' ? 'bg-ink text-paper' : 'hover:bg-cream',
            )}
          >
            <Icon name="grid" size={14} />
          </button>
          <button
            type="button"
            aria-label="Visualização em lista"
            onClick={() => setView('list')}
            className={cn(
              'grid size-9 cursor-pointer place-items-center transition-colors',
              view === 'list' ? 'bg-ink text-paper' : 'hover:bg-cream',
            )}
          >
            <Icon name="list" size={14} />
          </button>
        </div>
      </div>

      {/* Chips de filtros aplicados */}
      {chips.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {chips.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setChips((prev) => prev.filter((x) => x !== label))}
              className="inline-flex cursor-pointer items-center gap-2 border border-line px-3 py-1.5 text-body-xs hover:border-ink"
            >
              {label}
              <Icon name="close" size={11} />
            </button>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="py-24 text-center text-body-md text-ink-60">
          Nenhuma peça encontrada nesta categoria.
        </p>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-line">
          {sorted.map((p) => (
            <ProductListItem key={p.id} product={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-16 flex justify-center gap-3 text-body-sm">
          {Array.from({ length: totalPages }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'font-mono nums grid size-9 place-items-center border',
                i === 0 ? 'border-ink bg-ink text-paper' : 'border-line',
              )}
            >
              {i + 1}
            </span>
          ))}
        </nav>
      )}

      <p className="mt-8 text-center font-mono nums text-body-xs text-ink-60">
        {total} {total === 1 ? 'peça' : 'peças'} no total
      </p>
    </>
  );
}

function ProductListItem({ product }: { product: Product }) {
  const hasRange = product.priceFromCents !== product.priceToCents;
  const installment = installmentValue(product.priceFromCents, 6);
  const href = `/produto/${product.slug}` as Route;
  return (
    <Link
      href={href}
      className="group grid grid-cols-[200px_1fr_auto] items-center gap-8 py-6 hover:bg-cream/50"
    >
      <div className="relative aspect-[4/5] w-[200px] overflow-hidden bg-cream">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt ?? product.name}
            fill
            sizes="200px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="eyebrow !text-ink-40">{product.category.name}</div>
        <h3 className="font-display text-h5">{product.name}</h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 max-w-md text-body-sm leading-relaxed text-ink-60">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {!product.inStock && <Tag variant="line">Esgotado</Tag>}
          <span className="font-mono nums text-body">
            {product.variants.length} {product.variants.length === 1 ? 'variação' : 'variações'}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono nums text-h6">
          {hasRange ? (
            <>
              {formatMoney(product.priceFromCents)}{' '}
              <span className="text-ink-40">–</span>{' '}
              {formatMoney(product.priceToCents)}
            </>
          ) : (
            formatMoney(product.priceFromCents)
          )}
        </div>
        {product.inStock && (
          <div className="mt-1 text-body-xs text-ink-60">
            6x de <span className="font-mono nums">{formatMoney(installment)}</span> sem juros
          </div>
        )}
      </div>
    </Link>
  );
}
