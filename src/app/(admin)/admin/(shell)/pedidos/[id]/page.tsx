import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card, StatusBadge } from '@/components/admin/ui';
import { Icon, type IconName } from '@/components/ui/icon';
import {
  InvoiceForm,
  OrderStatusActions,
  TrackingForm,
} from '@/components/admin/orders/order-actions';
import { formatMoney } from '@/lib/utils/format';
import { getAdminToken } from '@/lib/auth/admin-session';
import { getAdminOrder } from '@/lib/api/endpoints/admin';
import { ApiError } from '@/lib/api/client';
import type { OrderStatus } from '@/lib/api/types';

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_TO_BADGE: Record<OrderStatus, 'pago' | 'aguardando' | 'preparando' | 'enviado' | 'entregue' | 'cancelado'> = {
  PENDING_PAYMENT: 'aguardando',
  PAID: 'pago',
  PREPARING: 'preparando',
  SHIPPED: 'enviado',
  DELIVERED: 'entregue',
  CANCELED: 'cancelado',
  REFUNDED: 'cancelado',
};

interface TimelineStep {
  icon: IconName;
  label: string;
  date: string;
  done: boolean;
  active?: boolean;
}

function buildTimeline(status: OrderStatus, createdAt: string, paidAt?: string | null): TimelineStep[] {
  const paid = ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const preparing = ['PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const shipped = ['SHIPPED', 'DELIVERED'].includes(status);
  const delivered = status === 'DELIVERED';

  return [
    { icon: 'check', label: 'Pedido', date: formatDateTime(createdAt), done: true },
    { icon: 'dollar', label: 'Pago', date: paidAt ? formatDateTime(paidAt) : paid ? 'feito' : 'aguardando', done: paid, active: status === 'PAID' },
    { icon: 'pkg', label: 'Preparando', date: preparing ? 'em andamento' : '—', done: preparing, active: status === 'PREPARING' },
    { icon: 'truck', label: 'Enviado', date: shipped ? 'em trânsito' : '—', done: shipped, active: status === 'SHIPPED' },
    { icon: 'home', label: 'Entregue', date: delivered ? 'feito' : '—', done: delivered, active: status === 'DELIVERED' },
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

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  let details;
  try {
    details = await getAdminOrder(token, id);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) notFound();
    throw err;
  }

  const { order, items, payments, shipment } = details;
  const payment = payments[0] ?? null;

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/pedidos' as Route} className="hover:text-ink">
              Pedidos
            </Link>
            <Icon name="chevronRight" size={10} />
            <span>Detalhe</span>
          </span>
        }
        title={
          <span className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-[30px]">{order.number}</span>
            <StatusBadge status={STATUS_TO_BADGE[order.status]} />
          </span>
        }
        action={<OrderStatusActions orderId={order.id} currentStatus={order.status} />}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-10">
        <div className="flex flex-col gap-4">
          <Card title="Linha do tempo">
            <div className="relative grid grid-cols-5 gap-2">
              <div className="absolute top-3.5 left-[10%] right-[10%] h-px bg-line" />
              {buildTimeline(order.status, order.createdAt, payment?.paidAt).map((s, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`grid size-7 place-items-center rounded-full border ${
                      s.done ? 'border-ink bg-ink text-paper' : 'border-line bg-paper text-ink-40'
                    } ${s.active ? 'ring-4 ring-ink/10' : ''}`}
                  >
                    <Icon name={s.icon} size={14} />
                  </div>
                  <div
                    className={`mt-2.5 text-body-sm font-medium ${
                      s.done ? 'text-ink' : 'text-ink-60'
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="mt-0.5 text-[10px] text-ink-60">{s.date}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Produtos do pedido"
            action={
              <span className="font-mono text-eyebrow text-ink-60">
                {items.length} {items.length > 1 ? 'itens' : 'item'}
              </span>
            }
          >
            <div>
              {items.map((p, i) => (
                <div
                  key={p.id}
                  className={`grid items-center gap-4 py-4 ${
                    i < items.length - 1 ? 'border-b border-line' : ''
                  }`}
                  style={{ gridTemplateColumns: '80px 1fr 100px 80px 100px' }}
                >
                  {p.productSnapshot.imageUrl ? (
                    <img
                      src={p.productSnapshot.imageUrl}
                      alt={p.productSnapshot.name}
                      className="h-24 w-20 object-cover"
                    />
                  ) : (
                    <div className="h-24 w-20 bg-cream" />
                  )}
                  <div>
                    <div className="font-display text-[17px] font-normal">{p.productSnapshot.name}</div>
                    {p.productSnapshot.attributes?.length > 0 && (
                      <div className="mt-1 text-eyebrow text-ink-60">
                        {p.productSnapshot.attributes
                          .map((a) => `${a.name}: ${a.value}`)
                          .join(' · ')}
                      </div>
                    )}
                    <div className="mt-1 font-mono text-eyebrow text-ink-60">{p.productSnapshot.sku}</div>
                  </div>
                  <span className="font-mono text-body-sm">{formatMoney(p.unitPriceCents)}</span>
                  <span className="text-center text-body-sm">
                    × <span className="font-mono">{p.quantity}</span>
                  </span>
                  <span className="text-right font-mono text-body-md font-medium">
                    {formatMoney(p.lineTotalCents)}
                  </span>
                </div>
              ))}
            </div>

            <div className="ml-auto mt-4 flex max-w-xs flex-col gap-2 border-t border-ink-20 pt-4 text-body-sm">
              <div className="flex justify-between">
                <span className="text-ink-60">Subtotal</span>
                <span className="font-mono">{formatMoney(order.itemsTotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-60">Frete</span>
                <span className="font-mono">{formatMoney(order.shippingTotalCents)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                <span className="text-body-md font-medium">Total</span>
                <span className="font-display text-h5 font-medium">
                  {formatMoney(order.grandTotalCents)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Cliente">
            <div className="flex flex-col gap-2 text-eyebrow text-ink-60">
              <div>
                <div className="text-ink-60">Nome</div>
                <div className="text-body-sm text-ink">{order.customer.name}</div>
              </div>
              <div>
                <div className="text-ink-60">E-mail</div>
                <div className="font-mono text-eyebrow text-ink">{order.customer.email}</div>
              </div>
              {order.customer.phone && (
                <div>
                  <div className="text-ink-60">Telefone</div>
                  <div className="font-mono text-ink">{order.customer.phone}</div>
                </div>
              )}
              {order.customer.cpf && (
                <div>
                  <div className="text-ink-60">CPF</div>
                  <div className="font-mono text-ink">{order.customer.cpf}</div>
                </div>
              )}
            </div>
          </Card>

          {payment && (
            <Card title="Pagamento">
              <div className="mb-3.5 flex items-center gap-3">
                <Icon name={payment.method === 'PIX' ? 'pix' : 'creditCard'} size={20} />
                <div className="flex-1">
                  <div className="text-body-sm font-medium">
                    {payment.method === 'PIX' ? 'PIX' : 'Cartão de crédito'}
                  </div>
                  {payment.installments && payment.installments > 1 && (
                    <div className="font-mono text-[10px] text-ink-60">
                      {payment.installments}x sem juros
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-eyebrow text-ink-60">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="font-mono text-ink">{payment.status}</span>
                </div>
                {payment.paidAt && (
                  <div className="flex justify-between">
                    <span>Aprovado em</span>
                    <span className="text-ink">{formatDateTime(payment.paidAt)}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card title="Nota fiscal">
            <InvoiceForm orderId={order.id} current={order.invoiceNumber ?? null} />
          </Card>

          <Card title="Envio">
            {shipment && (
              <div className="mb-3 flex flex-col gap-1.5 text-body-sm">
                <div className="flex justify-between">
                  <span className="text-ink-60">Modalidade</span>
                  <span>
                    {shipment.carrier} · {shipment.service}
                  </span>
                </div>
                {shipment.shippedAt && (
                  <div className="flex justify-between">
                    <span className="text-ink-60">Despachado</span>
                    <span>{formatDateTime(shipment.shippedAt)}</span>
                  </div>
                )}
              </div>
            )}
            <TrackingForm
              orderId={order.id}
              currentCode={shipment?.trackingCode ?? null}
              currentCarrier={shipment?.carrier ?? null}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
