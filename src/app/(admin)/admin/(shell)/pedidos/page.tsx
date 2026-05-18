import Link from 'next/link';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/admin/ui';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_ORDERS } from '@/lib/mock/admin';

export const metadata: Metadata = { title: 'Pedidos — Mabruk Admin' };

const STATS = [
  { label: 'Hoje', value: '24', sub: 'pedidos · R$ 6.840' },
  { label: 'Aguardando pagto.', value: '12', sub: 'há mais de 1h' },
  { label: 'Para preparar', value: '24', sub: 'imprimir etiquetas' },
  { label: 'Em trânsito', value: '18', sub: '2 com atraso' },
  { label: 'Ticket médio', value: 'R$ 307', sub: 'últimos 30 dias' },
];

const TABS = [
  { id: 'all', label: 'Todos', count: 284, dot: null, active: true },
  { id: 'aguardando', label: 'Aguardando', count: 12, dot: '#A8946F' },
  { id: 'preparando', label: 'Em preparação', count: 24, dot: '#6B6660' },
  { id: 'enviado', label: 'Enviados', count: 18, dot: '#0A0A0A' },
  { id: 'entregue', label: 'Entregues', count: 220, dot: '#3D6A4E' },
  { id: 'cancelado', label: 'Cancelados', count: 10, dot: '#8C3A2E' },
];

export default function OrdersListPage() {
  return (
    <>
      <AdminPageHeader
        subtitle="Operações"
        title="Pedidos"
        action={
          <>
            <Button variant="secondary" size="md" icon={<Icon name="upload" size={14} />}>
              Exportar
            </Button>
            <Button variant="secondary" size="md">
              Imprimir etiquetas
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <div key={s.label} className="border border-line bg-paper px-5 py-4.5">
              <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">
                {s.label}
              </div>
              <div className="mt-1.5 font-display text-h4 font-normal">{s.value}</div>
              <div className="mt-0.5 text-eyebrow text-ink-60">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="border border-line bg-paper">
          {/* Tabs + search */}
          <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3.5">
            <div className="flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-body-sm ${
                    t.active
                      ? 'bg-cream font-medium text-ink'
                      : 'text-ink-60 hover:text-ink'
                  }`}
                >
                  {t.dot && (
                    <span
                      className="size-1.5 rounded-full"
                      style={{ background: t.dot }}
                    />
                  )}
                  {t.label}
                  <span className="font-mono text-[10px] text-ink-40">{t.count}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ink-40">
                  <Icon name="search" size={14} />
                </span>
                <input
                  placeholder="Buscar nº pedido ou cliente"
                  className="!h-9 !w-[240px] !pl-9 !text-body-sm"
                />
              </div>
              <Button variant="ghost" size="sm" icon={<Icon name="filter" size={14} />}>
                Filtros
              </Button>
            </div>
          </div>

          {/* Header */}
          <div
            className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
            style={{
              gridTemplateColumns:
                '32px 130px 1.5fr 120px 110px 140px 1.1fr 80px 40px',
            }}
          >
            <input type="checkbox" className="!w-auto !m-0" />
            <span>Nº</span>
            <span>Cliente</span>
            <span>Data</span>
            <span className="text-right">Total</span>
            <span>Pagamento</span>
            <span>Status</span>
            <span>Frete</span>
            <span />
          </div>

          {/* Rows */}
          {ADMIN_ORDERS.map((o) => (
            <Link
              key={o.id}
              href={`/admin/pedidos/${o.id}` as Route}
              className="grid grid-cols-1 items-center gap-2 border-b border-line px-4 py-3.5 text-body-sm hover:bg-cream/40 lg:gap-4"
              style={{
                gridTemplateColumns:
                  'minmax(0, 1fr)',
              }}
            >
              <div
                className="grid items-center gap-3 lg:gap-4"
                style={{
                  gridTemplateColumns:
                    '32px 130px 1.5fr 120px 110px 140px 1.1fr 80px 40px',
                }}
              >
                <input type="checkbox" className="!w-auto !m-0" />
                <span className="font-mono text-body-sm">{o.id}</span>
                <div>
                  <div className="font-medium">{o.customer}</div>
                  <div className="text-eyebrow text-ink-60">{o.email}</div>
                </div>
                <span className="text-eyebrow text-ink-60">{o.date}</span>
                <div className="text-right">
                  <div className="font-mono font-medium">{formatMoney(o.total)}</div>
                  <div className="text-[10px] text-ink-60">
                    {o.items} {o.items > 1 ? 'itens' : 'item'}
                  </div>
                </div>
                <span className="text-eyebrow">{o.payment}</span>
                <StatusBadge status={o.status} />
                <span className="text-eyebrow text-ink-60">{o.shipping}</span>
                <Icon name="chevronRight" size={14} className="text-ink-60" />
              </div>
            </Link>
          ))}

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-body-sm text-ink-60">
            <span>
              Exibindo <span className="font-mono">1–12</span> de{' '}
              <span className="font-mono">284</span> pedidos
            </span>
            <div className="flex gap-1">
              <button type="button" className="border border-line px-2.5 py-1.5">
                <Icon name="arrowLeft" size={12} />
              </button>
              {[1, 2, 3, '…', 24].map((n, i) => (
                <button
                  key={i}
                  type="button"
                  className={`font-mono min-w-8 border px-2.5 py-1.5 ${
                    n === 1
                      ? 'border-ink bg-ink text-paper'
                      : 'border-line text-ink'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button type="button" className="border border-line px-2.5 py-1.5">
                <Icon name="arrowRight" size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
