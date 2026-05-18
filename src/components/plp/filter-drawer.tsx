'use client';

import { useEffect, useState } from 'react';
import type { Category, Collection, Tag } from '@/lib/api/types';
import { FilterSidebar } from './filter-sidebar';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type { PLPFilters } from './plp-client';

interface Props {
  categories: Category[];
  collections: Collection[];
  tags: Tag[];
  activeCategorySlug?: string;
  filters: PLPFilters;
  onFiltersChange: (next: PLPFilters) => void;
}

export function FilterDrawer({
  categories,
  collections,
  tags,
  activeCategorySlug,
  filters,
  onFiltersChange,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full cursor-pointer items-center justify-between border border-line bg-paper px-4 py-3 text-eyebrow font-medium uppercase tracking-eyebrow lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <Icon name="filter" size={14} />
          Filtrar
        </span>
        <Icon name="chevronRight" size={12} />
      </button>

      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={cn(
          'fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          'fixed top-0 right-0 z-[61] flex h-full w-full max-w-sm flex-col bg-paper shadow-modal transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-h5">Filtros</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar"
            className="cursor-pointer text-ink hover:text-ink-60"
          >
            <Icon name="close" size={22} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          <FilterSidebar
            categories={categories}
            collections={collections}
            tags={tags}
            activeCategorySlug={activeCategorySlug}
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
        </div>

        <footer className="flex items-center gap-3 border-t border-line px-5 py-4">
          <Button variant="primary" onClick={() => setOpen(false)} fullWidth>
            Aplicar
          </Button>
        </footer>
      </aside>
    </>
  );
}
