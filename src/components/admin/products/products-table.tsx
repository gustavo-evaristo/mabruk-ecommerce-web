'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Icon } from '@/components/ui/icon';
import { useAdminProducts } from '@/lib/hooks';
import type { AdminProductSummary } from '@/lib/api/endpoints/admin';
import { formatMoney } from '@/lib/utils/format';

function stockBadge(stock: number) {
  if (stock === 0)
    return { label: 'Esgotado', className: 'bg-[rgba(140,58,46,0.08)] text-sale' };
  if (stock < 10)
    return {
      label: `Baixo · ${stock}`,
      className: 'bg-[rgba(168,148,111,0.12)] text-champagne-dark',
    };
  return {
    label: `${stock} em estoque`,
    className: 'bg-[rgba(61,106,78,0.08)] text-success',
  };
}

interface Props {
  token: string;
  initialData: { items: AdminProductSummary[]; total: number };
}

export function ProductsTable({ token, initialData }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'ACTIVE' | 'DRAFT' | 'ARCHIVED'>('all');

  const filters = {
    search: search.trim() || undefined,
    status: status !== 'all' ? status : undefined,
    pageSize: 50,
  };

  const { data, isFetching } = useAdminProducts(token, filters, {
    initialData: !search.trim() && status === 'all' ? initialData : undefined,
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="border border-line bg-paper">
      <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3.5">
        <div className="flex flex-wrap gap-1">
          {(['all', 'ACTIVE', 'DRAFT', 'ARCHIVED'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3.5 py-2 text-body-sm ${
                status === s ? 'bg-cream font-medium' : 'text-ink-60 hover:text-ink'
              }`}
            >
              {s === 'all'
                ? 'Todos'
                : s === 'ACTIVE'
                  ? 'Ativos'
                  : s === 'DRAFT'
                    ? 'Rascunhos'
                    : 'Arquivados'}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome ou slug"
            className="!h-9 !w-[240px] !text-body-sm"
          />
          <div className="text-eyebrow text-ink-60">
            {isFetching ? '…' : `${total} ${total === 1 ? 'produto' : 'produtos'}`}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-16 text-center text-body-sm text-ink-60">
          Nenhum produto neste filtro.
        </div>
      ) : (
        <>
          <div
            className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
            style={{ gridTemplateColumns: '60px 1fr 100px 120px 120px 40px' }}
          >
            <span />
            <span>Produto</span>
            <span className="text-right">Preço</span>
            <span>Estoque</span>
            <span>Status</span>
            <span />
          </div>

          {items.map((p) => {
            const sb = stockBadge(p.totalStock);
            return (
              <Link
                key={p.id}
                href={`/admin/produtos/${p.id}/editar` as Route}
                className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm hover:bg-cream/40 lg:gap-4 lg:grid-cols-[60px_1fr_100px_120px_120px_40px]"
              >
                <div className="size-12 bg-cream">
                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="size-12 object-cover"
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="mt-0.5 font-mono text-eyebrow text-ink-60">
                    /{p.slug} · {p.category.name}
                  </div>
                </div>
                <span className="text-right font-mono">{formatMoney(p.priceFromCents)}</span>
                <span
                  className={`inline-flex self-start px-2.5 py-1 text-[10px] tracking-wide ${sb.className}`}
                >
                  {sb.label}
                </span>
                <span className="text-eyebrow text-ink-60">
                  {p.status === 'ACTIVE'
                    ? 'Publicado'
                    : p.status === 'DRAFT'
                      ? 'Rascunho'
                      : 'Arquivado'}
                </span>
                <Icon name="chevronRight" size={14} className="text-ink-60" />
              </Link>
            );
          })}
        </>
      )}
    </div>
  );
}
