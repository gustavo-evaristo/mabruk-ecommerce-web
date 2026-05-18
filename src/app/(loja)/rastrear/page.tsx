'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';
import { trackOrder } from '@/lib/api/endpoints/orders';
import { ApiError } from '@/lib/api/client';
import type { OrderStatus, OrderShipment } from '@/lib/api/types';

type Step = 'form' | 'result' | 'not-found';

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING_PAYMENT: { label: 'Aguardando pagamento', color: 'text-ink-60', bg: 'bg-ink-60' },
  PAID: { label: 'Pago', color: 'text-success', bg: 'bg-success' },
  PREPARING: { label: 'Em preparação', color: 'text-ink-60', bg: 'bg-ink-60' },
  SHIPPED: { label: 'A caminho', color: 'text-ink', bg: 'bg-ink' },
  DELIVERED: { label: 'Entregue', color: 'text-success', bg: 'bg-success' },
  CANCELED: { label: 'Cancelado', color: 'text-sale', bg: 'bg-sale' },
  REFUNDED: { label: 'Reembolsado', color: 'text-sale', bg: 'bg-sale' },
};

interface Result {
  number: string;
  status: OrderStatus;
  shipment: OrderShipment | null;
}

function buildSteps(
  status: OrderStatus,
): { icon: IconName; label: string; done: boolean; active: boolean }[] {
  const paid = ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const preparing = ['PREPARING', 'SHIPPED', 'DELIVERED'].includes(status);
  const shipped = ['SHIPPED', 'DELIVERED'].includes(status);
  const delivered = status === 'DELIVERED';
  return [
    { icon: 'check', label: 'Pedido recebido', done: true, active: false },
    { icon: 'dollar', label: 'Pagamento confirmado', done: paid, active: status === 'PAID' },
    { icon: 'pkg', label: 'Preparando', done: preparing, active: status === 'PREPARING' },
    { icon: 'truck', label: 'A caminho', done: shipped, active: status === 'SHIPPED' },
    { icon: 'home', label: 'Entregue', done: delivered, active: status === 'DELIVERED' },
  ];
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RastrearPage() {
  const [step, setStep] = useState<Step>('form');
  const [orderInput, setOrderInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const number = orderInput.trim().toUpperCase();
    const email = emailInput.trim();
    if (!number || !email) {
      setError('Informe o número do pedido e o e-mail.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await trackOrder(number, email);
      setResult(data as Result);
      setStep('result');
    } catch (err) {
      if (err instanceof ApiError && (err.statusCode === 404 || err.statusCode === 403)) {
        setStep('not-found');
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Não foi possível buscar o pedido agora. Tente novamente.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setStep('form');
  }

  return (
    <>
      <section className="border-b border-line bg-cream py-12 lg:py-16">
        <Container className="!max-w-[1080px]">
          <nav className="mb-3.5 text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
            <Link href="/">Início</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Rastrear pedido</span>
          </nav>
          <h1 className="font-display text-h2 leading-tight tracking-tight lg:text-[64px]">
            Rastrear <span className="em-italic">pedido</span>
          </h1>
          <p className="mt-4 max-w-xl text-body-md leading-relaxed text-ink-60 lg:text-body-lg">
            Acompanhe seu pedido em tempo real. Você não precisa estar logada — só precisa do
            número do pedido e do e-mail do comprador.
          </p>
        </Container>
      </section>

      <Container className="!max-w-[1080px] py-12 pb-16 lg:py-16 lg:pb-24">
        {step === 'form' && (
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div className="border border-line bg-paper p-6 lg:p-10">
              <div className="eyebrow mb-3">Acompanhamento</div>
              <h2 className="mb-7 font-display text-h3">Onde está meu pedido?</h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="mb-2 block text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
                    Número do pedido
                  </label>
                  <input
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    placeholder="MAB-0000"
                    className="font-mono"
                  />
                  <div className="mt-1.5 text-body-xs text-ink-60">
                    Você recebeu o número por e-mail logo após a compra.
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
                    E-mail do comprador
                  </label>
                  <input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="seu@email.com"
                    type="email"
                  />
                </div>

                {error && (
                  <div className="border border-sale bg-[rgba(140,58,46,0.08)] px-3.5 py-2.5 text-body-sm text-sale">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconRight={<Icon name="arrowRight" size={14} />}
                  disabled={loading}
                  className="mt-2"
                >
                  {loading ? 'Buscando…' : 'Rastrear pedido'}
                </Button>
              </form>

              <div className="mt-7 border-t border-line pt-6 text-body-sm leading-relaxed text-ink-60">
                Tem uma conta Mabruk?{' '}
                <Link href={'/entrar' as Route} className="text-ink underline">
                  Entre para ver todos os seus pedidos
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <HelpCard icon="pkg" title="Onde encontro o número?">
                No e-mail de confirmação que você recebeu logo após a compra. O formato é{' '}
                <strong className="font-mono nums text-ink">MAB-0000</strong>.
              </HelpCard>
              <HelpCard icon="truck" title="Como funciona?">
                Após o despacho, atualizamos o status a cada movimentação. O código de rastreio
                também é enviado por e-mail.
              </HelpCard>
              <HelpCard icon="bell" title="Precisa de ajuda?">
                Nosso time atende de seg a sex, 9h-18h.{' '}
                <a className="text-ink underline">Falar com atendimento →</a>
              </HelpCard>
            </div>
          </div>
        )}

        {step === 'not-found' && (
          <div className="mx-auto mt-8 max-w-lg border border-line bg-paper p-10 text-center lg:p-12">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-cream">
              <Icon name="search" size={24} stroke={1.2} className="text-ink-40" />
            </div>
            <h2 className="font-display text-h4">Pedido não encontrado</h2>
            <p className="mt-3.5 mb-7 text-body-sm leading-relaxed text-ink-60">
              Não localizamos um pedido com o número{' '}
              <strong className="font-mono nums text-ink">{orderInput}</strong> para este e-mail.
              Confira os dados e tente novamente.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={reset}>
                Tentar de novo
              </Button>
              <Button variant="primary">Falar com atendimento</Button>
            </div>
          </div>
        )}

        {step === 'result' && result && (
          <div className="flex flex-col gap-5">
            <div className="border border-line bg-paper">
              <div className="flex flex-col gap-4 border-b border-line bg-cream px-6 py-5 lg:flex-row lg:items-center lg:px-8">
                <div>
                  <div className="eyebrow">Pedido</div>
                  <div className="mt-1 font-mono nums text-h6 font-medium">{result.number}</div>
                </div>
                <div className="flex-1" />
                <span
                  className={cn(
                    'inline-flex items-center gap-2 self-start bg-ink/[0.06] px-3.5 py-1.5 text-eyebrow font-medium uppercase tracking-eyebrow lg:self-auto',
                    STATUS_CFG[result.status].color,
                  )}
                >
                  <span className={cn('size-1.5 rounded-full', STATUS_CFG[result.status].bg)} />
                  {STATUS_CFG[result.status].label}
                </span>
              </div>

              <div className="overflow-x-auto p-6 lg:p-8">
                <div className="relative grid min-w-[640px] grid-cols-5 gap-2 lg:min-w-0">
                  <div className="absolute top-[18px] right-[10%] left-[10%] h-px bg-line" />
                  {buildSteps(result.status).map((st) => (
                    <div
                      key={st.label}
                      className="relative z-10 flex flex-col items-center text-center"
                    >
                      <div
                        className={cn(
                          'grid size-9 place-items-center rounded-full border',
                          st.done
                            ? 'border-ink bg-ink text-cream'
                            : 'border-line bg-paper text-ink-40',
                          st.active && 'ring-6 ring-ink/10',
                        )}
                      >
                        <Icon name={st.icon} size={16} />
                      </div>
                      <div
                        className={cn(
                          'mt-3 text-body-xs font-medium',
                          st.done ? 'text-ink' : 'text-ink-60',
                        )}
                      >
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {result.shipment && (
              <div className="flex flex-col items-start gap-4 border border-ink bg-paper p-5 lg:flex-row lg:items-center lg:gap-5 lg:p-6">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-cream">
                  <Icon name="truck" size={20} stroke={1.2} />
                </div>
                <div className="flex-1">
                  <div className="eyebrow">Envio</div>
                  <div className="mt-1 font-display text-h6">
                    {result.shipment.carrier} · {result.shipment.service}
                  </div>
                  <div className="mt-1 text-body-xs text-ink-60">
                    {result.shipment.shippedAt
                      ? `Despachado em ${formatDateTime(result.shipment.shippedAt)}`
                      : 'Aguardando despacho'}
                    {result.shipment.deliveredAt &&
                      ` · Entregue em ${formatDateTime(result.shipment.deliveredAt)}`}
                  </div>
                </div>
                {result.shipment.trackingCode && (
                  <div className="flex flex-col items-start gap-1 lg:items-end">
                    <div className="eyebrow !text-ink-60">Código de rastreio</div>
                    <div className="font-mono text-body-md font-medium">
                      {result.shipment.trackingCode}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="arrowLeft" size={12} />}
                onClick={reset}
              >
                Buscar outro pedido
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">
                  Falar com atendimento
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

function HelpCard({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border border-line bg-paper p-5">
      <div className="grid size-9 shrink-0 place-items-center bg-cream">
        <Icon name={icon} size={16} />
      </div>
      <div>
        <div className="font-display text-body-xl">{title}</div>
        <div className="mt-1 text-body-xs leading-relaxed text-ink-60">{children}</div>
      </div>
    </div>
  );
}
