'use client';

import { useState } from 'react';
import type { Category, Collection, Tag } from '@/lib/api/types';
import { Icon } from '@/components/ui/icon';

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
  count?: number;
  checked?: boolean;
  onChange?: (next: boolean) => void;
  children: React.ReactNode;
}

function Check({ count, checked, onChange, children }: CheckProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-body text-ink-80">
      <span
        className={`grid size-3.5 place-items-center border ${checked ? 'border-ink bg-ink' : 'border-ink-20'}`}
      >
        {checked && <Icon name="check" size={10} stroke={2} className="text-cream" />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="flex-1">{children}</span>
      {count !== undefined && <span className="font-mono nums text-body-xs text-ink-40">{count}</span>}
    </label>
  );
}

interface Props {
  categories: Category[];
  collections: Collection[];
  tags: Tag[];
  activeCategorySlug?: string;
}

const BANHOS = [
  { value: 'OURO_18K' as const, label: 'Ouro 18k' },
  { value: 'OURO_ROSE' as const, label: 'Ouro rosé' },
  { value: 'RODIO' as const, label: 'Prata 925' },
];

export function FilterSidebar({ categories, collections, tags, activeCategorySlug }: Props) {
  const [banhos, setBanhos] = useState<Set<string>>(new Set());

  return (
    <aside className="flex flex-col">
      <FilterGroup title="Categoria">
        {categories.map((c) => (
          <Check key={c.id} checked={c.slug === activeCategorySlug}>
            {c.name}
          </Check>
        ))}
      </FilterGroup>

      <FilterGroup title="Coleção">
        {collections.map((col) => (
          <Check key={col.id}>{col.name}</Check>
        ))}
      </FilterGroup>

      <FilterGroup title="Banho">
        {BANHOS.map((b) => (
          <Check
            key={b.value}
            checked={banhos.has(b.value)}
            onChange={(next) => {
              const copy = new Set(banhos);
              if (next) copy.add(b.value);
              else copy.delete(b.value);
              setBanhos(copy);
            }}
          >
            {b.label}
          </Check>
        ))}
      </FilterGroup>

      <FilterGroup title="Preço">
        <div className="flex gap-2">
          <input type="text" placeholder="R$ 0" />
          <input type="text" placeholder="R$ 500" />
        </div>
      </FilterGroup>

      <FilterGroup title="Disponibilidade">
        <Check checked>Em estoque</Check>
        <Check>Pré-venda</Check>
      </FilterGroup>

      <FilterGroup title="Tags" defaultOpen={false}>
        {tags.map((t) => (
          <Check key={t.id}>{t.name}</Check>
        ))}
      </FilterGroup>

      <button
        type="button"
        className="mt-5 self-start text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60 underline"
      >
        Limpar filtros
      </button>
    </aside>
  );
}
