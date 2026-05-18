'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import type { Banho, Category, Collection, Tag } from '@/lib/api/types';
import { Icon } from '@/components/ui/icon';
import type { PLPFilters } from './plp-client';

interface FilterGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-eyebrow font-medium uppercase tracking-eyebrow-lg">{title}</span>
        <Icon name={open ? 'minus' : 'plus'} size={14} />
      </button>
      {open && <div className="mt-4 flex flex-col gap-2.5">{children}</div>}
    </div>
  );
}

interface CheckProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  children: React.ReactNode;
}

function Check({ checked, onChange, children }: CheckProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-body text-ink-80">
      <span
        className={`grid size-3.5 place-items-center border ${
          checked ? 'border-ink bg-ink' : 'border-ink-20'
        }`}
      >
        {checked && <Icon name="check" size={10} stroke={2} className="text-cream" />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}

interface Props {
  categories: Category[];
  collections: Collection[];
  tags: Tag[];
  activeCategorySlug?: string;
  filters: PLPFilters;
  onFiltersChange: (next: PLPFilters) => void;
}

const BANHOS: { value: Banho; label: string }[] = [
  { value: 'OURO_18K', label: 'Ouro 18k' },
  { value: 'PRATA_925', label: 'Prata 925' },
  { value: 'ACO_INOX', label: 'Aço inoxidável' },
];

export function FilterSidebar({
  categories,
  collections,
  tags,
  activeCategorySlug,
  filters,
  onFiltersChange,
}: Props) {
  function toggleBanho(banho: Banho) {
    const next = new Set(filters.banhos);
    if (next.has(banho)) next.delete(banho);
    else next.add(banho);
    onFiltersChange({ ...filters, banhos: next });
  }

  function clear() {
    onFiltersChange({
      banhos: new Set(),
      collectionSlug: null,
      tagSlug: null,
      inStock: false,
      sort: 'newest',
    });
  }

  return (
    <aside className="flex flex-col">
      <FilterGroup title="Categoria">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/${c.slug}` as Route}
            className={`text-body text-ink-80 ${
              c.slug === activeCategorySlug ? 'font-medium text-ink' : 'hover:text-ink'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </FilterGroup>

      {collections.length > 0 && (
        <FilterGroup title="Coleção">
          {collections.map((col) => (
            <Check
              key={col.id}
              checked={filters.collectionSlug === col.slug}
              onChange={(next) =>
                onFiltersChange({
                  ...filters,
                  collectionSlug: next ? col.slug : null,
                })
              }
            >
              {col.name}
            </Check>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Banho">
        {BANHOS.map((b) => (
          <Check
            key={b.value}
            checked={filters.banhos.has(b.value)}
            onChange={() => toggleBanho(b.value)}
          >
            {b.label}
          </Check>
        ))}
      </FilterGroup>

      <FilterGroup title="Disponibilidade">
        <Check
          checked={filters.inStock}
          onChange={(next) => onFiltersChange({ ...filters, inStock: next })}
        >
          Em estoque
        </Check>
      </FilterGroup>

      {tags.length > 0 && (
        <FilterGroup title="Tags" defaultOpen={false}>
          {tags.map((t) => (
            <Check
              key={t.id}
              checked={filters.tagSlug === t.slug}
              onChange={(next) =>
                onFiltersChange({ ...filters, tagSlug: next ? t.slug : null })
              }
            >
              {t.name}
            </Check>
          ))}
        </FilterGroup>
      )}

      <button
        type="button"
        onClick={clear}
        className="mt-5 self-start text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60 underline"
      >
        Limpar filtros
      </button>
    </aside>
  );
}
