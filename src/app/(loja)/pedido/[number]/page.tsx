import Link from 'next/link';
import type { Route } from 'next';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { getAuthToken } from '@/lib/auth/session';
import { getMyOrderByNumber } from '@/lib/api/endpoints/orders';
import { getCustomerMe } from '@/lib/api/endpoints/customers';
import type { OrderDetails, OrderStatus } from '@/lib/api/types';

interface Props {
  params: Promise<{ number: string }>;
}

interface TimelineStep {
  icon: IconName;
  title: string;
  desc: string;
  done: boolean;
  active?: boolean;
}

function buildTimeline(status: OrderStatus): TimelineStep[] {
  const paid = ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const preparing = ['PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const shipped = ['SHIPPED', 'DELIVERED'].includes(status);
  const delivered = status === 'DELIVERED';

  return [
    { icon: 'check', title: 'Pedido recebido', desc: 'Agora mesmo', done: true, active: status === 'PENDING_PAYMENT' },
    { icon: 'box', title: 'Pagamento confirmado', desc: paid ? 'feito' : 'aguardando', done: paid, active: status === 'PAID' },
    { icon: 'pkg', title: 'Preparando seu pedido', desc: preparing ? 'em andamento' : 'até 1 dia útil', done: preparing, active: status === 'PREPARING' },
    { icon: 'truck', title: 'A caminho', desc: shipped ? 'em trânsito' : 'previsão 5-7 dias', done: shipped, active: status === 'SHIPPED' },
    { icon: 'home', title: 'Entregue', desc: delivered ? 'feito' : 'previsão até 7 dias', done: delivered, active: status === 'DELIVERED' },
  ];
}

export default async function PedidoConfirmacaoPage({ params }: Props) {
  const { number } = await params;
  const token = await getAuthToken();

  let details: OrderDetails | null = null;
  let customerName: string | null = null;
  let customerEmail: string | null = null;

  if (token) {
    try {
      details = await getMyOrderByNumber(token, number);
    } catch {
      /* mostra fallback */
    }
    try {
      const me = await getCustomerMe(token);
      customerName = me.name.split(/\s+/)[0] ?? me.name;
      customerEmail = me.email;
    } catch {
      /* fallback abaixo */
    }
  }

  // Sem auth ou sem acesso ao pedido → versão simplificada
  if (!details) {
    return (
      <section className="bg-cream py-14 lg:py-20">
        <Container className="!max-w-[720px]">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-ink text-cream lg:size-20">
              <Icon name="check" size={28} stroke={1.5} className="lg:!size-8" />
            </div>
            <div className="eyebrow-hero">Pedido confirmado</div>
            <h1 className="font-display text-h2 lg:text-h1">Obrigada!</h1>
            <p className="max-w-lg text-body-lg leading-relaxed text-ink-60">
              Recebemos seu pedido. Enviamos uma cópia para o e-mail cadastrado com todos os
              detalhes — incluindo o código de rastreio quando ele despachar.
            </p>
            <div className="mt-4 border border-line bg-paper px-5 py-2.5 font-mono nums text-body-md">
              Pedido #{number}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={'/' as Route}>
                <Button variant="primary">Continuar comprando</Button>
              </Link>
              <Link href={'/rastrear' as Route}>
                <Button variant="secondary">Rastrear pedido</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  const { order, items, payments, shipment } = details;
  const payment = payments[0] ?? null;
  const isPix = payment?.method === 'PIX';

  return (
    <>
      <section className="bg-cream py-14 text-center lg:py-20">
        <Container className="!max-w-[720px]">
          <div className="flex flex-col items-center gap-5">
            <div className="grid size-16 place-items-center rounded-full bg-ink text-cream lg:size-20">
              <Icon name="check" size={28} stroke={1.5} className="lg:!size-8" />
            </div>
            <div className="eyebrow-hero">Pedido confirmado</div>
            <h1 className="font-display text-h2 lg:text-h1">
              Obrigada
              {customerName && (
                <>
                  , <span className="em-italic">{customerName}</span>
                </>
              )}
            </h1>
            <p className="max-w-lg text-body-lg leading-relaxed text-ink-60">
              {isPix && payment?.status !== 'APPROVED'
                ? 'Recebemos seu pedido! Abra o app do seu banco e escaneie o QR code abaixo para concluir o pagamento via PIX.'
                : 'Recebemos seu pedido e já estamos preparando suas peças. Você receberá um e-mail com todos os detalhes e o código de rastreio assim que despacharmos.'}
            </p>
            <div className="mt-4 border border-line bg-paper px-5 py-2.5 font-mono nums text-body-md">
              Pedido #{order.number}
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 lg:gap-16 lg:grid-cols-[1fr_380px] lg:py-20">
        <div className="flex flex-col gap-12">
          {isPix && payment?.qrCode && payment.status !== 'APPROVED' && (
            <section className="border border-line p-8">
              <h2 className="mb-4 font-display text-h4">Pague via PIX</h2>
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                {payment.qrCodeBase64 ? (
                  <img
                    src={`data:image/png;base64,${payment.qrCodeBase64}`}
                    alt="QR code PIX"
                    className="size-56 shrink-0 bg-cream"
                  />
                ) : (
                  <div className="grid size-56 shrink-0 place-items-center bg-cream font-mono text-body-xs text-ink-40">
                    [QR code]
                  </div>
                )}
                <div className="flex flex-col gap-3 text-body-sm">
                  <div>
                    <div className="eyebrow">Valor</div>
                    <div className="mt-1 font-display text-h3">
                      {formatMoney(payment.amountCents)}
                    </div>
                  </div>
                  <div>
                    <div className="eyebrow">PIX copia e cola</div>
                    <div className="mt-1 break-all bg-cream p-3 font-mono text-body-xs">
                      {payment.qrCode}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-6 font-display text-h4">Acompanhe seu pedido</h2>
            <div className="flex flex-col">
              {buildTimeline(order.status).map((s, i, arr) => (
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
                    {i < arr.length - 1 && (
                      <div className={`min-h-8 w-px flex-1 ${s.done ? 'bg-ink' : 'bg-line'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div
                      className={`text-body font-medium ${s.done ? 'text-ink' : 'text-ink-60'}`}
                    >
                      {s.title}
                    </div>
                    <div className="mt-1 text-body-xs text-ink-60">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-8 border-t border-line pt-8 md:grid-cols-2">
            {payment && (
              <div>
                <div className="eyebrow">Pagamento</div>
                <div className="mt-3 flex items-center gap-2.5 text-body">
                  <Icon name={isPix ? 'pix' : 'creditCard'} size={18} />
                  {isPix ? 'PIX' : 'Cartão de crédito'}
                </div>
                {!isPix && payment.installments && payment.installments > 1 && (
                  <div className="mt-1.5 text-body-xs text-ink-60">
                    {payment.installments}x de{' '}
                    <span className="font-mono nums">
                      {formatMoney(Math.round(payment.amountCents / payment.installments))}
                    </span>{' '}
                    sem juros
                  </div>
                )}
              </div>
            )}
            {shipment && (
              <div>
                <div className="eyebrow">Envio</div>
                <div className="mt-3 text-body">
                  {shipment.carrier} · {shipment.service}
                </div>
                <div className="mt-1.5 text-body-xs text-ink-60">
                  prazo estimado: {shipment.estimatedDays} dias úteis
                </div>
              </div>
            )}
          </section>

          <section className="flex flex-wrap gap-3 pt-4">
            <Link href={'/' as Route}>
              <Button variant="primary">Continuar comprando</Button>
            </Link>
            <Link href={`/conta/pedidos/${order.number}` as Route}>
              <Button variant="secondary">Ver detalhes na minha conta</Button>
            </Link>
          </section>
        </div>

        <aside className="self-start bg-cream p-8">
          <h3 className="font-display text-h5">Resumo</h3>
          <div className="mt-4 flex flex-col gap-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-ink-60">Subtotal</span>
              <span className="font-mono nums">{formatMoney(order.itemsTotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-60">Frete</span>
              <span className="font-mono nums">{formatMoney(order.shippingTotalCents)}</span>
            </div>
          </div>
          <div className="my-4 h-px bg-ink/10" />
          <div className="flex items-baseline justify-between">
            <span className="text-body-md font-medium">Total</span>
            <span className="font-display text-h4">{formatMoney(order.grandTotalCents)}</span>
          </div>

          {items.length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <div className="eyebrow mb-3">Itens</div>
              <ul className="flex flex-col gap-2 text-body-sm">
                {items.map((i) => (
                  <li key={i.id} className="flex justify-between gap-3">
                    <span className="min-w-0 truncate">
                      {i.quantity}× {i.productSnapshot.name}
                    </span>
                    <span className="font-mono nums">{formatMoney(i.lineTotalCents)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {customerEmail && (
            <div className="mt-5 bg-paper p-3 text-body-xs leading-relaxed text-ink-60">
              <div className="flex items-start gap-2">
                <Icon name="bell" size={14} />
                <span>
                  Enviamos uma cópia para{' '}
                  <strong className="text-ink">{customerEmail}</strong>
                </span>
              </div>
            </div>
          )}
        </aside>
      </Container>
    </>
  );
}
