import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { formatMoney } from '@/lib/utils/format';
import { getAuthToken } from '@/lib/auth/session';
import { listMyOrders } from '@/lib/api/endpoints/orders';
import type { OrderStatus } from '@/lib/api/types';

const STATUS_VARIANT: Record<
  OrderStatus,
  { label: string; variant: 'default' | 'success' | 'sale' | 'line' }
> = {
  PENDING_PAYMENT: { label: 'Aguardando pagamento', variant: 'default' },
  PAID: { label: 'Pago', variant: 'success' },
  PREPARING: { label: 'Em preparação', variant: 'default' },
  SHIPPED: { label: 'Enviado', variant: 'line' },
  DELIVERED: { label: 'Entregue', variant: 'success' },
  CANCELED: { label: 'Cancelado', variant: 'sale' },
  REFUNDED: { label: 'Reembolsado', variant: 'sale' },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function ContaPedidosPage() {
  const token = await getAuthToken();
  if (!token) redirect('/entrar');

  const { items, total } = await listMyOrders(token, { pageSize: 50 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-h3">Meus pedidos</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          {total} {total === 1 ? 'pedido' : 'pedidos'} · histórico completo da sua conta
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border border-dashed border-line bg-paper py-16 text-center">
          <Icon name="pkg" size={36} className="text-ink-40" />
          <h3 className="font-display text-h5">Nenhum pedido por aqui ainda</h3>
          <p className="max-w-sm text-body-sm text-ink-60">
            Quando você fizer sua primeira compra, ela aparece nesta lista.
          </p>
          <Link href={'/' as Route}>
            <Button variant="primary" size="sm" iconRight={<Icon name="arrowRight" size={12} />}>
              Explorar peças
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {items.map((o) => {
            const status = STATUS_VARIANT[o.status];
            return (
              <Link
                key={o.id}
                href={`/conta/pedidos/${o.number}` as Route}
                className="grid grid-cols-[1fr_auto] items-center gap-6 border-b border-line py-6 hover:bg-cream"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono nums text-body">#{o.number}</span>
                    <Tag variant={status.variant}>{status.label}</Tag>
                  </div>
                  <div className="mt-1.5 text-body-xs text-ink-60">
                    {formatDate(o.createdAt)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono nums text-body-md">
                    {formatMoney(o.grandTotalCents)}
                  </div>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-eyebrow font-medium uppercase tracking-eyebrow text-ink">
                    Detalhes
                    <Icon name="arrowRight" size={11} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
