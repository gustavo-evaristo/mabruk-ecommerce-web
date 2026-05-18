import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/admin/ui';
import { formatMoney } from '@/lib/utils/format';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminOrders } from '@/lib/api/endpoints/admin';
import type { OrderStatus } from '@/lib/api/types';

export const metadata: Metadata = { title: 'Pedidos — Mabruk Admin' };

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
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}

export default async function OrdersListPage({ searchParams }: Props) {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const { status, search, page } = await searchParams;
  const activeTab = (status as OrderStatus | 'all' | undefined) ?? 'all';

  const { items, total } = await listAdminOrders(token, {
    status: activeTab !== 'all' ? activeTab : undefined,
    search,
    page: page ? Number(page) : 1,
    pageSize: 30,
  }).catch(() => ({ items: [], total: 0, page: 1, pageSize: 30 }));

  return (
    <>
      <AdminPageHeader
        subtitle="Operações"
        title="Pedidos"
        action={
          <Button variant="secondary" size="md" icon={<Icon name="upload" size={14} />}>
            Exportar
          </Button>
        }
      />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <div className="border border-line bg-paper">
          <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3.5">
            <div className="flex flex-wrap gap-1">
              {TABS.map((t) => {
                const isActive = activeTab === t.id;
                const href =
                  t.id === 'all'
                    ? ('/admin/pedidos' as Route)
                    : (`/admin/pedidos?status=${t.id}` as Route);
                return (
                  <Link
                    key={t.id}
                    href={href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 text-body-sm ${
                      isActive ? 'bg-cream font-medium text-ink' : 'text-ink-60 hover:text-ink'
                    }`}
                  >
                    {t.dot && (
                      <span className="size-1.5 rounded-full" style={{ background: t.dot }} />
                    )}
                    {t.label}
                  </Link>
                );
              })}
            </div>
            <div className="ml-auto text-eyebrow text-ink-60">
              {total} {total === 1 ? 'pedido' : 'pedidos'}
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
                  <span className="text-eyebrow text-ink-60">
                    {formatDate(o.createdAt)}
                  </span>
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
      </div>
    </>
  );
}
