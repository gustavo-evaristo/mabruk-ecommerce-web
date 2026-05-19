'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import type { AvailableAttribute, Category, Collection, Tag } from '@/lib/api/types';
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
  availableAttributes: AvailableAttribute[];
  filters: PLPFilters;
  onFiltersChange: (next: PLPFilters) => void;
}

export function FilterSidebar({
  categories,
  collections,
  tags,
  activeCategorySlug,
  availableAttributes,
  filters,
  onFiltersChange,
}: Props) {
  function toggleAttributeValue(attrSlug: string, valueSlug: string) {
    const current = filters.attributes[attrSlug] ?? new Set<string>();
    const next = new Set(current);
    if (next.has(valueSlug)) next.delete(valueSlug);
    else next.add(valueSlug);
    const nextAttrs = { ...filters.attributes };
    if (next.size === 0) delete nextAttrs[attrSlug];
    else nextAttrs[attrSlug] = next;
    onFiltersChange({ ...filters, attributes: nextAttrs });
  }

  function clear() {
    onFiltersChange({
      attributes: {},
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

      {availableAttributes.map((attr) => (
        <FilterGroup key={attr.slug} title={attr.name}>
          {attr.type === 'COLOR' ? (
            <div className="flex flex-wrap gap-2">
              {attr.values.map((v) => {
                const checked = filters.attributes[attr.slug]?.has(v.slug) ?? false;
                return (
                  <button
                    key={v.slug}
                    type="button"
                    onClick={() => toggleAttributeValue(attr.slug, v.slug)}
                    title={`${v.name} (${v.count})`}
                    className={`relative grid size-8 place-items-center rounded-full border-2 ${
                      checked ? 'border-ink' : 'border-line hover:border-ink-60'
                    }`}
                    aria-label={v.name}
                  >
                    <span
                      className="size-6 rounded-full"
                      style={{ backgroundColor: v.hex ?? '#ccc' }}
                    />
                    {checked && (
                      <span className="absolute inset-0 grid place-items-center text-paper mix-blend-difference">
                        <Icon name="check" size={11} stroke={2} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            attr.values.map((v) => {
              const checked = filters.attributes[attr.slug]?.has(v.slug) ?? false;
              return (
                <Check
                  key={v.slug}
                  checked={checked}
                  onChange={() => toggleAttributeValue(attr.slug, v.slug)}
                >
                  {v.name}{' '}
                  <span className="text-ink-40">({v.count})</span>
                </Check>
              );
            })
          )}
        </FilterGroup>
      ))}

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
