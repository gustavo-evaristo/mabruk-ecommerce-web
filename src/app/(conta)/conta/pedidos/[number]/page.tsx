import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Route } from 'next';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/utils/format';
import { getAuthToken } from '@/lib/auth/session';
import { getMyOrderByNumber } from '@/lib/api/endpoints/orders';
import { ApiError } from '@/lib/api/client';
import type { OrderStatus, OrderDetails } from '@/lib/api/types';

interface Props {
  params: Promise<{ number: string }>;
}

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

function buildTimeline(
  details: OrderDetails,
): { icon: IconName; title: string; date: string; done: boolean }[] {
  const status = details.order.status;
  const paid = ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const preparing = ['PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const shipped = ['SHIPPED', 'DELIVERED'].includes(status);
  const delivered = status === 'DELIVERED';

  return [
    { icon: 'check', title: 'Pedido recebido', date: formatDateTime(details.order.createdAt), done: true },
    { icon: 'box', title: 'Pagamento confirmado', date: paid ? 'feito' : 'pendente', done: paid },
    { icon: 'pkg', title: 'Preparando seu pedido', date: preparing ? 'em andamento' : '—', done: preparing },
    {
      icon: 'truck',
      title: 'A caminho',
      date: shipped
        ? details.shipment?.shippedAt
          ? formatDateTime(details.shipment.shippedAt)
          : 'em trânsito'
        : '—',
      done: shipped,
    },
    {
      icon: 'home',
      title: 'Entregue',
      date: delivered
        ? details.shipment?.deliveredAt
          ? formatDateTime(details.shipment.deliveredAt)
          : 'feito'
        : '—',
      done: delivered,
    },
  ];
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function OrderDetailsPage({ params }: Props) {
  const { number } = await params;
  const token = await getAuthToken();
  if (!token) redirect('/entrar');

  let details: OrderDetails;
  try {
    details = await getMyOrderByNumber(token, number);
  } catch (err) {
    if (err instanceof ApiError && (err.statusCode === 404 || err.statusCode === 403)) {
      notFound();
    }
    throw err;
  }

  const { order, items, payments, shipment } = details;
  const statusCfg = STATUS_VARIANT[order.status];
  const timeline = buildTimeline(details);
  const payment = payments[0] ?? null;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href={'/conta/pedidos' as Route}
          className="inline-flex items-center gap-2 text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60"
        >
          <Icon name="arrowLeft" size={12} />
          Todos os pedidos
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-h3">
            Pedido <span className="font-mono nums">{order.number}</span>
          </h2>
          <Tag variant={statusCfg.variant}>{statusCfg.label}</Tag>
        </div>
        <p className="mt-1.5 text-body-sm text-ink-60">
          Realizado em {formatDateTime(order.createdAt)}
        </p>
      </div>

      <section>
        <h3 className="mb-5 font-display text-h5">Acompanhamento</h3>
        <div className="flex flex-col">
          {timeline.map((s, i) => (
            <div key={s.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-full border ${
                    s.done
                      ? 'border-ink bg-ink text-cream'
                      : 'border-line bg-paper text-ink-40'
                  }`}
                >
                  <Icon name={s.icon} size={16} />
                </div>
                {i < timeline.length - 1 && (
                  <div className={`min-h-8 w-px flex-1 ${s.done ? 'bg-ink' : 'bg-line'}`} />
                )}
              </div>
              <div className="flex-1 pb-5">
                <div className={`text-body font-medium ${s.done ? 'text-ink' : 'text-ink-60'}`}>
                  {s.title}
                </div>
                <div className="mt-0.5 text-body-xs text-ink-60">{s.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line pt-8">
        <h3 className="mb-4 font-display text-h5">Itens</h3>
        <div className="flex flex-col divide-y divide-line">
          {items.map((it) => (
            <div
              key={it.id}
              className="grid grid-cols-[80px_1fr_auto] items-center gap-4 py-4"
            >
              {it.productSnapshot.imageUrl ? (
                <img
                  src={it.productSnapshot.imageUrl}
                  alt={it.productSnapshot.name}
                  className="aspect-[4/5] w-20 object-cover"
                />
              ) : (
                <div className="aspect-[4/5] w-20 bg-cream" />
              )}
              <div>
                <div className="font-display text-body-xl">{it.productSnapshot.name}</div>
                {it.productSnapshot.attributes?.length > 0 && (
                  <div className="text-body-xs text-ink-60">
                    {it.productSnapshot.attributes
                      .map((a) => `${a.name}: ${a.value}`)
                      .join(' · ')}
                  </div>
                )}
                <div className="mt-1 text-body-xs">
                  {it.quantity} ×{' '}
                  <span className="font-mono nums">{formatMoney(it.unitPriceCents)}</span>
                </div>
              </div>
              <div className="font-mono nums text-body-md">
                {formatMoney(it.lineTotalCents)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream p-6">
        <div className="flex flex-col gap-2 text-body-sm">
          <div className="flex justify-between">
            <span className="text-ink-60">Subtotal</span>
            <span className="font-mono nums">{formatMoney(order.itemsTotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-60">
              Frete{shipment ? ` (${shipment.service})` : ''}
            </span>
            <span className="font-mono nums">{formatMoney(order.shippingTotalCents)}</span>
          </div>
          <div className="my-2 h-px bg-ink/10" />
          <div className="flex items-baseline justify-between">
            <span className="text-body-md font-medium">Total</span>
            <span className="font-display text-h4">{formatMoney(order.grandTotalCents)}</span>
          </div>
        </div>
      </section>

      {payment && (
        <section className="grid gap-8 border-t border-line pt-8 md:grid-cols-2">
          <div>
            <div className="eyebrow">Pagamento</div>
            <div className="mt-3 flex items-center gap-2.5 text-body">
              <Icon name={payment.method === 'PIX' ? 'pix' : 'creditCard'} size={18} />
              {payment.method === 'PIX' ? 'PIX' : 'Cartão de crédito'}
            </div>
            {payment.installments && payment.installments > 1 && (
              <div className="mt-1.5 text-body-xs text-ink-60">
                {payment.installments}x de{' '}
                <span className="font-mono nums">
                  {formatMoney(Math.round(payment.amountCents / payment.installments))}
                </span>{' '}
                sem juros
              </div>
            )}
          </div>
          {shipment && (
            <div>
              <div className="eyebrow">Envio</div>
              <div className="mt-3 text-body">
                {shipment.carrier} · {shipment.service}
              </div>
              {shipment.trackingCode && (
                <div className="mt-1.5 font-mono nums text-body-sm text-ink-60">
                  Cód.: {shipment.trackingCode}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      <section className="flex gap-3">
        <Link href={`/rastrear?number=${order.number}` as Route}>
          <Button variant="secondary" size="md" icon={<Icon name="truck" size={14} />}>
            Rastrear envio
          </Button>
        </Link>
      </section>
    </div>
  );
}
