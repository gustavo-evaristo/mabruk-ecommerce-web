'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Icon, type IconName } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

type Step = 'form' | 'result' | 'not-found';
type OrderStatus = 'pago' | 'preparando' | 'enviado' | 'entregue' | 'cancelado';

const STATUS_CFG: Record<OrderStatus, { label: string; color: string }> = {
  pago: { label: 'Pago', color: 'text-success' },
  preparando: { label: 'Em preparação', color: 'text-ink-60' },
  enviado: { label: 'A caminho', color: 'text-ink' },
  entregue: { label: 'Entregue', color: 'text-success' },
  cancelado: { label: 'Cancelado', color: 'text-sale' },
};

const STATUS_BG: Record<OrderStatus, string> = {
  pago: 'bg-success',
  preparando: 'bg-ink-60',
  enviado: 'bg-ink',
  entregue: 'bg-success',
  cancelado: 'bg-sale',
};

const MOCK_ORDER = {
  id: 'MAB-04812',
  placedAt: '15 de maio · 14h32',
  status: 'enviado' as OrderStatus,
  items: 2,
  totalCents: 48890,
  shippingMethod: 'SEDEX',
  estimate: '19 a 21 de maio',
  trackingCode: 'BR932184771BR',
  address: {
    city: 'Jardins · São Paulo, SP',
    zip: '01415-003',
  },
  timeline: [
    { icon: 'check' as IconName, label: 'Pedido recebido', date: '15 mai · 14h32', done: true, active: false },
    { icon: 'dollar' as IconName, label: 'Pagamento confirmado', date: '15 mai · 14h33', done: true, active: false },
    { icon: 'pkg' as IconName, label: 'Preparando seu pedido', date: '15 mai · 18h12', done: true, active: false },
    {
      icon: 'truck' as IconName,
      label: 'A caminho',
      date: '16 mai · 09h47',
      done: true,
      active: true,
      detail: 'Em trânsito · Centro de distribuição São Paulo / SP',
    },
    { icon: 'home' as IconName, label: 'Entregue', date: 'Previsto 19-21 mai', done: false, active: false },
  ],
  trackingHistory: [
    { date: '16 mai · 09h47', city: 'São Paulo · SP', event: 'Objeto saiu para entrega' },
    { date: '15 mai · 22h18', city: 'São Paulo · SP', event: 'Objeto recebido no centro de distribuição' },
    { date: '15 mai · 19h05', city: 'São Paulo · SP', event: 'Objeto postado · Ag. Vila Mariana' },
  ],
  items_list: [
    { name: 'Colar Pingente Lumière', variant: 'Ouro 18k · qtd 1' },
    { name: 'Brinco Argola Mira', variant: 'Ouro 18k · qtd 1' },
  ],
};

export default function RastrearPage() {
  const [step, setStep] = useState<Step>('form');
  const [orderInput, setOrderInput] = useState('');
  const [docInput, setDocInput] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = orderInput.trim().toUpperCase();
    if (!code) return;
    if (code.startsWith('MAB-') || /^\d{5,}$/.test(code)) {
      setStep('result');
    } else {
      setStep('not-found');
    }
  }

  return (
    <>
      {/* Page header */}
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
            número do pedido e do CPF do comprador.
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
                    style={{ letterSpacing: '0.04em' }}
                  />
                  <div className="mt-1.5 text-body-xs text-ink-60">
                    Você recebeu o número por e-mail logo após a compra.
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
                    CPF do comprador
                  </label>
                  <input
                    value={docInput}
                    onChange={(e) => setDocInput(e.target.value)}
                    placeholder="000.000.000-00"
                    type="tel"
                    className="font-mono"
                    style={{ letterSpacing: '0.04em' }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconRight={<Icon name="arrowRight" size={14} />}
                  className="mt-2"
                >
                  Rastrear pedido
                </Button>
              </form>

              <div className="mt-7 border-t border-line pt-6 text-body-sm leading-relaxed text-ink-60">
                Tem uma conta Mabruk?{' '}
                <Link href={'/entrar' as Route} className="text-ink underline">
                  Entre para ver todos os seus pedidos
                </Link>
              </div>
            </div>

            {/* Side help */}
            <div className="flex flex-col gap-4">
              <HelpCard icon="pkg" title="Onde encontro o número?">
                No e-mail de confirmação que você recebeu logo após a compra. O formato é{' '}
                <strong className="font-mono nums text-ink">MAB-0000</strong>.
              </HelpCard>
              <HelpCard icon="truck" title="Como funciona?">
                Após o despacho, atualizamos o status a cada movimentação dos Correios. O código de
                rastreio também é enviado por e-mail.
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
              <strong className="font-mono nums text-ink">{orderInput}</strong>. Confira o número e
              o CPF e tente novamente.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={() => setStep('form')}>
                Tentar de novo
              </Button>
              <Button variant="primary">Falar com atendimento</Button>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="flex flex-col gap-5">
            {/* Header card */}
            <div className="border border-line bg-paper">
              <div className="flex flex-col gap-4 border-b border-line bg-cream px-6 py-5 lg:flex-row lg:items-center lg:px-8">
                <div>
                  <div className="eyebrow">Pedido</div>
                  <div className="mt-1 font-mono nums text-h6 font-medium">{MOCK_ORDER.id}</div>
                </div>
                <div className="flex-1 text-body-xs text-ink-60 lg:flex lg:justify-center lg:gap-8 lg:text-center">
                  <span>
                    Realizado em <strong className="text-ink">{MOCK_ORDER.placedAt}</strong>
                  </span>
                  <span className="ml-3 lg:ml-0">
                    {MOCK_ORDER.items} {MOCK_ORDER.items > 1 ? 'itens' : 'item'} ·{' '}
                    <strong className="font-mono nums text-ink">{formatMoney(MOCK_ORDER.totalCents)}</strong>
                  </span>
                </div>
                <span
                  className={cn(
                    'inline-flex items-center gap-2 self-start bg-ink/[0.06] px-3.5 py-1.5 text-eyebrow font-medium uppercase tracking-eyebrow lg:self-auto',
                    STATUS_CFG[MOCK_ORDER.status].color,
                  )}
                >
                  <span className={cn('size-1.5 rounded-full', STATUS_BG[MOCK_ORDER.status])} />
                  {STATUS_CFG[MOCK_ORDER.status].label}
                </span>
              </div>

              {/* Timeline */}
              <div className="overflow-x-auto p-6 lg:p-8">
                <div className="relative grid min-w-[640px] grid-cols-5 gap-2 lg:min-w-0">
                  <div className="absolute top-[18px] right-[10%] left-[10%] h-px bg-line" />
                  {MOCK_ORDER.timeline.map((st) => (
                    <div
                      key={st.label}
                      className="relative z-10 flex flex-col items-center text-center"
                    >
                      <div
                        className={cn(
                          'grid size-9 place-items-center rounded-full border',
                          st.done ? 'border-ink bg-ink text-cream' : 'border-line bg-paper text-ink-40',
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
                      <div className="mt-1 text-[10px] text-ink-60">{st.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current status detail */}
            <div className="flex flex-col items-start gap-4 border border-ink bg-paper p-5 lg:flex-row lg:items-center lg:gap-5 lg:p-6">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-ink text-cream">
                <Icon name="truck" size={20} stroke={1.2} />
              </div>
              <div className="flex-1">
                <div className="eyebrow">Status atual</div>
                <div className="mt-1 font-display text-h6">Seu pedido está a caminho</div>
                <div className="mt-1 text-body-xs text-ink-60">
                  {MOCK_ORDER.timeline.find((t) => t.active)?.detail ?? 'Em trânsito'} · Previsão
                  de entrega: <strong className="text-ink">{MOCK_ORDER.estimate}</strong>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1 lg:items-end">
                <div className="eyebrow !text-ink-60">Código Correios</div>
                <div className="font-mono text-body-md font-medium">{MOCK_ORDER.trackingCode}</div>
                <a className="mt-1 text-body-xs text-ink underline">
                  Acompanhar no site dos Correios →
                </a>
              </div>
            </div>

            {/* Tracking history + summary */}
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="border border-line bg-paper">
                <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:px-6">
                  <div className="text-eyebrow font-medium uppercase tracking-eyebrow">
                    Histórico de movimentação
                  </div>
                  <span className="font-mono nums text-body-xs text-ink-60">
                    {MOCK_ORDER.trackingHistory.length} eventos
                  </span>
                </div>
                <div className="px-5 pb-5 lg:px-6">
                  {MOCK_ORDER.trackingHistory.map((ev, i, arr) => (
                    <div
                      key={ev.date}
                      className={cn(
                        'relative grid grid-cols-[14px_1fr] gap-4 py-4',
                        i < arr.length - 1 && 'border-b border-line',
                      )}
                    >
                      <div className="relative flex justify-center">
                        <div
                          className={cn(
                            'mt-1 size-2.5 rounded-full',
                            i === 0 ? 'bg-ink' : 'bg-ink-20',
                          )}
                        />
                        {i < arr.length - 1 && (
                          <div className="absolute top-3 -bottom-4 w-px bg-line" />
                        )}
                      </div>
                      <div>
                        <div className="text-body font-medium">{ev.event}</div>
                        <div className="mt-1 text-body-xs text-ink-60">
                          {ev.date} · {ev.city}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border border-line bg-paper">
                  <div className="border-b border-line px-5 py-4 text-eyebrow font-medium uppercase tracking-eyebrow lg:px-6">
                    Itens do pedido
                  </div>
                  <div className="px-5 pt-3 pb-4 lg:px-6">
                    {MOCK_ORDER.items_list.map((it, i, arr) => (
                      <div
                        key={it.name}
                        className={cn(
                          'flex items-center gap-3 py-2.5',
                          i < arr.length - 1 && 'border-b border-line',
                        )}
                      >
                        <div className="h-14 w-12 shrink-0 bg-cream" />
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-body-md">{it.name}</div>
                          <div className="mt-0.5 text-[10px] text-ink-60">{it.variant}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-line bg-paper p-5 lg:p-6">
                  <div className="eyebrow">Endereço de entrega</div>
                  <div className="mt-3 text-body leading-relaxed">
                    {MOCK_ORDER.address.city}
                    <br />
                    <span className="font-mono nums">{MOCK_ORDER.address.zip}</span>
                  </div>
                </div>

                <div className="bg-cream p-5 lg:p-6">
                  <div className="eyebrow">Atualizações</div>
                  <p className="mt-2.5 text-body-xs leading-relaxed text-ink-80">
                    Você recebe um e-mail a cada movimentação. Se quiser também por WhatsApp,{' '}
                    <a className="text-ink underline">cadastre seu número</a>.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <Button
                variant="ghost"
                size="sm"
                icon={<Icon name="arrowLeft" size={12} />}
                onClick={() => setStep('form')}
              >
                Buscar outro pedido
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">
                  Baixar nota fiscal
                </Button>
                <Button variant="secondary" size="sm">
                  Solicitar troca
                </Button>
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
    <div className="bg-cream p-5 lg:p-6">
      <div className="mb-2.5 flex items-center gap-3">
        <Icon name={icon} size={18} />
        <div className="text-body font-semibold">{title}</div>
      </div>
      <p className="text-body-sm leading-relaxed text-ink-60">{children}</p>
    </div>
  );
}
