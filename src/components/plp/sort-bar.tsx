'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Novidades' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'name_asc', label: 'Nome (A–Z)' },
] as const;

interface Props {
  totalCount: number;
  onToggleFilters?: () => void;
  filtersOpen?: boolean;
}

export function SortBar({ totalCount, onToggleFilters, filtersOpen }: Props) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<string>('newest');

  return (
    <div className="sticky top-[187px] z-10 border-b border-line bg-paper">
      <div className="container-mabruk flex items-center justify-between py-3.5">
        <button
          type="button"
          onClick={onToggleFilters}
          className="flex items-center gap-2 text-eyebrow font-medium uppercase tracking-eyebrow"
        >
          <Icon name="filter" size={16} />
          {filtersOpen ? 'Ocultar filtros' : 'Filtros'}
        </button>
        <div className="flex items-center gap-6 text-eyebrow font-medium uppercase">
          <span className="hidden font-mono nums tracking-normal text-ink-60 normal-case md:inline">
            {totalCount} {totalCount === 1 ? 'peça' : 'peças'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-ink-60">Ordenar</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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
              className={cn('grid size-9 place-items-center', view === 'grid' && 'bg-ink text-paper')}
            >
              <Icon name="grid" size={14} />
            </button>
            <button
              type="button"
              aria-label="Visualização em lista"
              onClick={() => setView('list')}
              className={cn('grid size-9 place-items-center', view === 'list' && 'bg-ink text-paper')}
            >
              <Icon name="list" size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
