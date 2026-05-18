'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Icon } from '@/components/ui/icon';
import { useAdminCustomers } from '@/lib/hooks';
import type { AdminCustomerListResult } from '@/lib/api/endpoints/admin';

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
  token: string;
  initialData: AdminCustomerListResult;
}

export function CustomersTable({ token, initialData }: Props) {
  const [search, setSearch] = useState('');

  const filters = {
    search: search.trim() || undefined,
    pageSize: 50,
  };

  const { data, isFetching } = useAdminCustomers(token, filters, {
    initialData: !search.trim() ? initialData : undefined,
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="border border-line bg-paper">
      <div className="flex items-center gap-4 border-b border-line px-4 py-3.5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar nome ou e-mail"
          className="!h-9 !w-[280px] !text-body-sm"
        />
        <div className="ml-auto text-eyebrow text-ink-60">
          {isFetching ? '…' : `${total} ${total === 1 ? 'cliente' : 'clientes'}`}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-16 text-center text-body-sm text-ink-60">
          Nenhum cliente.
        </div>
      ) : (
        <>
          <div
            className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
            style={{ gridTemplateColumns: '1fr 1.2fr 1fr 140px 40px' }}
          >
            <span>Cliente</span>
            <span>E-mail</span>
            <span>Telefone</span>
            <span>Cadastrado</span>
            <span />
          </div>

          {items.map((c) => (
            <Link
              key={c.id}
              href={`/admin/clientes/${c.id}` as Route}
              className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm hover:bg-cream/40 lg:gap-4 lg:grid-cols-[1fr_1.2fr_1fr_140px_40px]"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-full bg-cream text-eyebrow font-semibold text-ink">
                  {initials(c.name)}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium">{c.name}</div>
                </div>
              </div>
              <span className="truncate text-body-sm text-ink-80">{c.email}</span>
              <span className="text-body-sm text-ink-60">
                {c.phone ? <span className="font-mono">{c.phone}</span> : '—'}
              </span>
              <span className="text-eyebrow text-ink-60">{formatDate(c.createdAt)}</span>
              <Icon name="chevronRight" size={14} className="text-ink-60" />
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
