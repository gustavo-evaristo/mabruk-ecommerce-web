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
import { getAdminDashboard, listAdminOrders } from '@/lib/api/endpoints/admin';
import type { OrderStatus } from '@/lib/api/types';

export const metadata: Metadata = { title: 'Visão geral — Mabruk Admin' };

const STATUS_TO_BADGE: Record<OrderStatus, 'pago' | 'aguardando' | 'preparando' | 'enviado' | 'entregue' | 'cancelado'> = {
  PENDING_PAYMENT: 'aguardando',
  PAID: 'pago',
  PREPARING: 'preparando',
  SHIPPED: 'enviado',
  DELIVERED: 'entregue',
  CANCELED: 'cancelado',
  REFUNDED: 'cancelado',
};

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.max(1, Math.round((now - d) / 60000));
  if (diffMin < 60) return `${diffMin}m`;
  const h = Math.round(diffMin / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
}

export default async function AdminDashboardPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const [dashboard, recentOrders] = await Promise.all([
    getAdminDashboard(token).catch(() => null),
    listAdminOrders(token, { pageSize: 6 }).catch(() => ({
      items: [],
      total: 0,
      page: 1,
      pageSize: 6,
    })),
  ]);

  const dash = dashboard ?? {
    salesTotalCents: 0,
    ordersCount: 0,
    averageTicketCents: 0,
    pendingOrdersCount: 0,
    lowStockCount: 0,
    topProducts: [] as { variantId: string; productId: string; productName: string; quantity: number }[],
    range: { from: '', to: '' },
  };

  const kpis = [
    {
      label: 'Receita',
      value: formatMoney(dash.salesTotalCents),
      sub: `período de 30 dias`,
    },
    {
      label: 'Pedidos',
      value: String(dash.ordersCount),
      sub: dash.ordersCount === 1 ? 'pedido' : 'pedidos',
    },
    {
      label: 'Ticket médio',
      value: formatMoney(dash.averageTicketCents),
      sub: 'por pedido',
    },
    {
      label: 'Aguardando pagto.',
      value: String(dash.pendingOrdersCount),
      sub: 'em aberto',
    },
    {
      label: 'Estoque baixo',
      value: String(dash.lowStockCount),
      sub: '≤ 3 unidades',
    },
  ];

  return (
    <>
      <AdminPageHeader
        action={
          <>
            <Button variant="secondary" size="sm" icon={<Icon name="upload" size={12} />}>
              Exportar
            </Button>
            <Link href={'/admin/produtos/novo' as Route}>
              <Button variant="primary" size="sm" icon={<Icon name="plus" size={12} />}>
                Novo produto
              </Button>
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-4 p-6">
        {/* KPI rail */}
        <div className="grid grid-cols-2 border border-line bg-paper sm:grid-cols-3 lg:grid-cols-5">
          {kpis.map((kpi, i) => (
            <div
              key={kpi.label}
              className={`px-5 py-4.5 ${i > 0 ? 'border-l border-line' : ''}`}
            >
              <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">
                {kpi.label}
              </div>
              <div className="mt-2 text-[20px] font-semibold tracking-tight whitespace-nowrap">
                {kpi.value}
              </div>
              <div className="mt-1 text-eyebrow text-ink-60">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* Top produtos */}
        {dash.topProducts.length > 0 && (
          <div className="border border-line bg-paper">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="text-body-sm font-semibold">
                Top {dash.topProducts.length} produtos · 30 dias
              </div>
              <Link
                href={'/admin/produtos' as Route}
                className="text-[10px] uppercase tracking-eyebrow-lg text-ink-60"
              >
                Ver todos
              </Link>
            </div>
            <div>
              {dash.topProducts.map((p, i) => (
                <div
                  key={p.variantId}
                  className={`grid items-center gap-3 px-5 py-3 text-body-sm ${
                    i < dash.topProducts.length - 1 ? 'border-b border-line' : ''
                  }`}
                  style={{ gridTemplateColumns: '24px 1fr 80px' }}
                >
                  <span className="text-body-xs font-semibold text-ink-40">{i + 1}</span>
                  <div className="font-medium">{p.productName}</div>
                  <span className="text-right font-mono">{p.quantity} un.</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pedidos recentes */}
        <div className="border border-line bg-paper">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <div className="text-body-sm font-semibold">Pedidos recentes</div>
            <Link
              href={'/admin/pedidos' as Route}
              className="text-eyebrow font-medium tracking-wide text-ink"
            >
              Ver todos →
            </Link>
          </div>

          {recentOrders.items.length === 0 ? (
            <div className="px-5 py-10 text-center text-body-sm text-ink-60">
              Nenhum pedido ainda.
            </div>
          ) : (
            <>
              <div
                className="hidden bg-cream text-[10px] font-medium uppercase tracking-wide text-ink-60 md:grid"
                style={{ gridTemplateColumns: '110px 1fr 100px 130px 60px 40px' }}
              >
                <span className="px-5 py-2.5">Pedido</span>
                <span className="py-2.5">Cliente</span>
                <span className="py-2.5 text-right">Total</span>
                <span className="py-2.5">Status</span>
                <span className="py-2.5 text-right">Há</span>
                <span />
              </div>

              {recentOrders.items.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/pedidos/${o.id}` as Route}
                  className="grid items-center gap-4 border-b border-line px-5 py-3 text-body-sm last:border-0 hover:bg-cream/50 md:grid-cols-[110px_1fr_100px_130px_60px_40px]"
                >
                  <span className="font-mono font-semibold">{o.number}</span>
                  <div>
                    <div className="font-medium">{o.customer.name}</div>
                    <div className="mt-0.5 text-[10px] text-ink-60">{o.customer.email}</div>
                  </div>
                  <span className="font-mono font-semibold md:text-right">
                    {formatMoney(o.grandTotalCents)}
                  </span>
                  <StatusBadge status={STATUS_TO_BADGE[o.status]} />
                  <span className="text-[10px] text-ink-60 md:text-right">
                    há {timeAgo(o.createdAt)}
                  </span>
                  <Icon name="chevronRight" size={14} className="hidden text-ink-40 md:block" />
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
