'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/admin/ui';
import { useAdminOrders } from '@/lib/hooks';
import type { AdminOrderListResult } from '@/lib/api/endpoints/admin';
import type { OrderStatus } from '@/lib/api/types';
import { formatMoney } from '@/lib/utils/format';

const STATUS_TO_BADGE: Record<OrderStatus, 'pago' | 'aguardando' | 'preparando' | 'enviado' | 'entregue' | 'cancelado'> = {
  PENDING_PAYMENT: 'aguardando',
  PAID: 'pago',
  PREPARING: 'preparando',
  SHIPPED: 'enviado',
  DELIVERED: 'entregue',
  CANCELED: 'cancelado',
  REFUNDED: 'cancelado',
};

interface TabDef {
  id: 'all' | OrderStatus;
  label: string;
  dot?: string;
}

const TABS: TabDef[] = [
  { id: 'all', label: 'Todos' },
  { id: 'PENDING_PAYMENT', label: 'Aguardando', dot: '#A8946F' },
  { id: 'PREPARING', label: 'Em preparação', dot: '#6B6660' },
  { id: 'SHIPPED', label: 'Enviados', dot: '#0A0A0A' },
  { id: 'DELIVERED', label: 'Entregues', dot: '#3D6A4E' },
  { id: 'CANCELED', label: 'Cancelados', dot: '#8C3A2E' },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  token: string;
  initialData: AdminOrderListResult;
}

export function OrdersTable({ token, initialData }: Props) {
  const [tab, setTab] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');

  const filters = {
    status: tab !== 'all' ? tab : undefined,
    search: search.trim() || undefined,
    pageSize: 30,
  };

  const { data, isFetching } = useAdminOrders(token, filters, {
    initialData: tab === 'all' && !search.trim() ? initialData : undefined,
    placeholderData: (prev) => prev,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="border border-line bg-paper">
      <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3.5">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-body-sm ${
                  isActive ? 'bg-cream font-medium text-ink' : 'text-ink-60 hover:text-ink'
                }`}
              >
                {t.dot && <span className="size-1.5 rounded-full" style={{ background: t.dot }} />}
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nº ou cliente"
            className="!h-9 !w-[240px] !text-body-sm"
          />
          <div className="text-eyebrow text-ink-60">
            {isFetching ? '…' : `${total} ${total === 1 ? 'pedido' : 'pedidos'}`}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-16 text-center text-body-sm text-ink-60">
          Nenhum pedido neste filtro.
        </div>
      ) : (
        <>
          <div
            className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
            style={{ gridTemplateColumns: '130px 1.5fr 120px 110px 140px 40px' }}
          >
            <span>Nº</span>
            <span>Cliente</span>
            <span>Data</span>
            <span className="text-right">Total</span>
            <span>Status</span>
            <span />
          </div>

          {items.map((o) => (
            <Link
              key={o.id}
              href={`/admin/pedidos/${o.id}` as Route}
              className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm hover:bg-cream/40 lg:gap-4 lg:grid-cols-[130px_1.5fr_120px_110px_140px_40px]"
            >
              <span className="font-mono text-body-sm">{o.number}</span>
              <div>
                <div className="font-medium">{o.customer.name}</div>
                <div className="text-eyebrow text-ink-60">{o.customer.email}</div>
              </div>
              <span className="text-eyebrow text-ink-60">{formatDate(o.createdAt)}</span>
              <div className="text-right">
                <div className="font-mono font-medium">{formatMoney(o.grandTotalCents)}</div>
              </div>
              <StatusBadge status={STATUS_TO_BADGE[o.status]} />
              <Icon name="chevronRight" size={14} className="text-ink-60" />
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
