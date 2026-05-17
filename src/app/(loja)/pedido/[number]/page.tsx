import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { formatMoney, installmentValue } from '@/lib/utils/format';

interface Props {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ method?: string; total?: string }>;
}

const TIMELINE: { icon: IconName; title: string; desc: string; done: boolean; active?: boolean }[] = [
  { icon: 'check', title: 'Pedido recebido', desc: 'Agora mesmo', done: true, active: true },
  { icon: 'box', title: 'Pagamento confirmado', desc: 'Em até 1 hora', done: false },
  { icon: 'pkg', title: 'Preparando seu pedido', desc: 'Até 1 dia útil', done: false },
  { icon: 'truck', title: 'A caminho', desc: 'Previsão: 5-7 dias úteis', done: false },
  { icon: 'home', title: 'Entregue', desc: 'Em até 7 dias úteis', done: false },
];

export default async function PedidoConfirmacaoPage({ params, searchParams }: Props) {
  const { number } = await params;
  const { method, total: totalQ } = await searchParams;
  const total = totalQ ? Number(totalQ) : 48890;
  const isPix = method === 'pix';

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
              Obrigada, <span className="em-italic">Gustavo</span>
            </h1>
            <p className="max-w-lg text-body-lg leading-relaxed text-ink-60">
              {isPix
                ? 'Recebemos seu pedido! Abra o app do seu banco e escaneie o QR code abaixo para concluir o pagamento via PIX. O código expira em 30 minutos.'
                : 'Recebemos seu pedido e já estamos preparando suas peças. Você receberá um e-mail com todos os detalhes e o código de rastreio assim que despacharmos.'}
            </p>
            <div className="mt-4 border border-line bg-paper px-5 py-2.5 font-mono nums text-body-md">
              Pedido #{number}
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 lg:gap-16 lg:grid-cols-[1fr_380px] lg:py-20">
        {/* Timeline + Address */}
        <div className="flex flex-col gap-12">
          {isPix && (
            <section className="border border-line p-8">
              <h2 className="mb-4 font-display text-h4">Pague via PIX</h2>
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="grid size-56 shrink-0 place-items-center bg-cream font-mono text-body-xs text-ink-40">
                  [QR code do PIX]
                </div>
                <div className="flex flex-col gap-3 text-body-sm">
                  <div>
                    <div className="eyebrow">Valor</div>
                    <div className="mt-1 font-display text-h3">{formatMoney(total)}</div>
                  </div>
                  <div>
                    <div className="eyebrow">PIX copia e cola</div>
                    <div className="mt-1 break-all bg-cream p-3 font-mono text-body-xs">
                      00020126360014BR.GOV.BCB.PIX0114+551199999...
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={<Icon name="check" size={12} />}>
                    Copiar código
                  </Button>
                </div>
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-6 font-display text-h4">Acompanhe seu pedido</h2>
            <div className="flex flex-col">
              {TIMELINE.map((s, i) => (
                <div key={s.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`grid size-9 shrink-0 place-items-center rounded-full border ${s.done ? 'border-ink bg-ink text-cream' : 'border-line bg-paper text-ink-40'}`}
                    >
                      <Icon name={s.icon} size={16} />
                    </div>
                    {i < TIMELINE.length - 1 && (
                      <div
                        className={`min-h-8 w-px flex-1 ${s.done ? 'bg-ink' : 'bg-line'}`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className={`text-body font-medium ${s.done ? 'text-ink' : 'text-ink-60'}`}>
                      {s.title}
                    </div>
                    <div className="mt-1 text-body-xs text-ink-60">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-8 border-t border-line pt-8 md:grid-cols-2">
            <div>
              <div className="eyebrow">Endereço de entrega</div>
              <div className="mt-3 text-body leading-relaxed">
                Gustavo Evaristo
                <br />
                R. Bela Cintra, 1024 · apto 82
                <br />
                Jardins, São Paulo, SP
                <br />
                01415-003
              </div>
            </div>
            <div>
              <div className="eyebrow">Pagamento</div>
              <div className="mt-3 flex items-center gap-2.5 text-body">
                <Icon name={isPix ? 'pix' : 'creditCard'} size={18} />
                {isPix ? 'PIX · aguardando pagamento' : 'Cartão Visa · final 4291'}
              </div>
              {!isPix && (
                <div className="mt-1.5 text-body-xs text-ink-60">
                  em 6x de <span className="font-mono nums">{formatMoney(installmentValue(total, 6))}</span> sem juros
                </div>
              )}
            </div>
          </section>

          <section className="flex gap-3 pt-4">
            <Link href="/">
              <Button variant="primary">Continuar comprando</Button>
            </Link>
            <Link href={'/conta/pedidos' as never}>
              <Button variant="secondary">Ver detalhes na minha conta</Button>
            </Link>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="self-start bg-cream p-8">
          <h3 className="font-display text-h5">Resumo</h3>
          <div className="mt-4 flex flex-col gap-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-ink-60">Subtotal</span>
              <span className="font-mono nums">{formatMoney(total - 2990)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-60">Frete</span>
              <span className="font-mono nums">{formatMoney(2990)}</span>
            </div>
          </div>
          <div className="my-4 h-px bg-ink/10" />
          <div className="flex items-baseline justify-between">
            <span className="text-body-md font-medium">Total pago</span>
            <span className="font-display text-h4">{formatMoney(total)}</span>
          </div>
          <div className="mt-5 bg-paper p-3 text-body-xs leading-relaxed text-ink-60">
            <div className="flex items-start gap-2">
              <Icon name="bell" size={14} />
              <span>
                Enviamos uma cópia do pedido para{' '}
                <strong className="text-ink">gustavo@email.com.br</strong>
              </span>
            </div>
          </div>
        </aside>
      </Container>
    </>
  );
}
