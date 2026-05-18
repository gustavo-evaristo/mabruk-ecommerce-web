import Link from 'next/link';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_ORDERS } from '@/lib/mock/admin';

interface Props {
  params: Promise<{ id: string }>;
}

interface TimelineStep {
  icon: IconName;
  label: string;
  date: string;
  done: boolean;
  active?: boolean;
}

const TIMELINE: TimelineStep[] = [
  { icon: 'check', label: 'Pedido', date: 'Hoje · 14h32', done: true },
  { icon: 'dollar', label: 'Pago', date: 'Hoje · 14h33', done: true },
  { icon: 'pkg', label: 'Preparando', date: 'Em andamento', done: true, active: true },
  { icon: 'truck', label: 'Enviado', date: 'Previsto: 16 mai', done: false },
  { icon: 'home', label: 'Entregue', date: 'Previsto: 19-21 mai', done: false },
];

const ITEMS = [
  { name: 'Colar Lumière', sku: 'COL-LUM-OURO', variant: 'Ouro 18k · 45cm', price: 28900, qty: 1 },
  { name: 'Brinco Mira', sku: 'BRI-MIRA-PRATA', variant: 'Ouro 18k · médio', price: 18900, qty: 1 },
];

const ACTIVITY = [
  { author: 'Sistema', action: 'Pagamento confirmado · Cartão Visa final 4291', time: 'hoje · 14h33', note: false },
  { author: 'Sistema', action: 'Pedido recebido e aguardando pagamento', time: 'hoje · 14h32', note: false },
  { author: 'Mariana A.', action: 'Cliente recorrente · cuidado especial com embalagem', time: 'hoje · 14h35', note: true },
];

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `${id} — Mabruk Admin` };
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = ADMIN_ORDERS.find((o) => o.id === id) ?? ADMIN_ORDERS[0];

  const subtotal = ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 2990;
  const total = subtotal + shipping;

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
            <span className="font-mono text-[30px]">{order.id}</span>
            <span className="inline-flex bg-[rgba(61,106,78,0.08)] px-3 py-1.5 text-eyebrow uppercase tracking-eyebrow-lg text-success">
              Pago · em preparação
            </span>
          </span>
        }
        action={
          <>
            <Button variant="secondary" size="md" icon={<Icon name="upload" size={14} />}>
              Imprimir etiqueta
            </Button>
            <Button variant="secondary" size="md">Nota fiscal</Button>
            <Button variant="primary" size="md" icon={<Icon name="truck" size={14} />}>
              Marcar como enviado
            </Button>
          </>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_360px] lg:p-10">
        <div className="flex flex-col gap-4">
          {/* Timeline */}
          <Card title="Linha do tempo">
            <div className="relative grid grid-cols-5 gap-2">
              <div className="absolute top-3.5 left-[10%] right-[10%] h-px bg-line" />
              {TIMELINE.map((s, i) => (
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

          {/* Items */}
          <Card
            title="Produtos do pedido"
            action={
              <span className="font-mono text-eyebrow text-ink-60">
                {ITEMS.length} {ITEMS.length > 1 ? 'itens' : 'item'}
              </span>
            }
          >
            <div>
              {ITEMS.map((p, i) => (
                <div
                  key={i}
                  className={`grid items-center gap-4 py-4 ${
                    i < ITEMS.length - 1 ? 'border-b border-line' : ''
                  }`}
                  style={{ gridTemplateColumns: '80px 1fr 100px 80px 100px' }}
                >
                  <div className="h-24 w-20 bg-cream" />
                  <div>
                    <div className="font-display text-[17px] font-normal">{p.name}</div>
                    <div className="mt-1 text-eyebrow text-ink-60">{p.variant}</div>
                    <div className="mt-1 font-mono text-eyebrow text-ink-60">{p.sku}</div>
                  </div>
                  <span className="font-mono text-body-sm">{formatMoney(p.price)}</span>
                  <span className="text-center text-body-sm">
                    × <span className="font-mono">{p.qty}</span>
                  </span>
                  <span className="text-right font-mono text-body-md font-medium">
                    {formatMoney(p.price * p.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="ml-auto mt-4 flex max-w-xs flex-col gap-2 border-t border-ink-20 pt-4 text-body-sm">
              <div className="flex justify-between">
                <span className="text-ink-60">Subtotal</span>
                <span className="font-mono">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-60">Frete (SEDEX)</span>
                <span className="font-mono">{formatMoney(shipping)}</span>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                <span className="text-body-md font-medium">Total</span>
                <span className="font-display text-h5 font-medium">{formatMoney(total)}</span>
              </div>
            </div>
          </Card>

          {/* Activity */}
          <Card
            title="Atividade interna"
            action={<Button variant="ghost" size="sm">+ Adicionar nota</Button>}
          >
            <div className="flex flex-col">
              {ACTIVITY.map((a, i) => (
                <div
                  key={i}
                  className={`flex gap-3 py-2.5 ${
                    i < ACTIVITY.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <div
                    className={`grid size-7 place-items-center rounded-full text-[10px] font-semibold ${
                      a.note ? 'bg-champagne text-ink' : 'bg-cream text-ink'
                    }`}
                  >
                    {a.author === 'Sistema'
                      ? '◆'
                      : a.author
                          .split(' ')
                          .map((w) => w[0])
                          .join('')}
                  </div>
                  <div className="flex-1">
                    <div className="text-body-sm">
                      <strong>{a.author}</strong> · {a.action}
                    </div>
                    <div className="mt-1 text-[10px] text-ink-60">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <Card
            title="Cliente"
            action={
              <Link
                href={'/admin/clientes' as Route}
                className="text-[10px] uppercase tracking-eyebrow underline"
              >
                Ver perfil
              </Link>
            }
          >
            <div className="mb-4 flex items-center gap-3.5">
              <div className="grid size-11 place-items-center rounded-full bg-ink text-body-md font-semibold text-paper">
                HV
              </div>
              <div className="flex-1">
                <div className="font-display text-lead">Helena Vasconcellos</div>
                <div className="text-eyebrow text-ink-60">helena@email.com.br</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-eyebrow text-ink-60">
              <div className="flex justify-between">
                <span>Telefone</span>
                <span className="font-mono text-ink">(11) 99821-4471</span>
              </div>
              <div className="flex justify-between">
                <span>CPF</span>
                <span className="font-mono text-ink">328.****.901-22</span>
              </div>
              <div className="flex justify-between">
                <span>Pedidos anteriores</span>
                <span className="font-mono text-ink">3 · R$ 1.247</span>
              </div>
              <div className="flex justify-between">
                <span>Desde</span>
                <span className="text-ink">jan/2025</span>
              </div>
            </div>
          </Card>

          <Card
            title="Endereço de entrega"
            action={
              <button
                type="button"
                className="text-[10px] uppercase tracking-eyebrow underline"
              >
                Editar
              </button>
            }
          >
            <div className="text-body leading-relaxed">
              Helena Vasconcellos
              <br />
              R. Bela Cintra, 1024 · apto 82
              <br />
              Jardins · São Paulo, SP
              <br />
              <span className="font-mono">01415-003</span>
            </div>
            <div className="mt-3 bg-cream p-3 text-eyebrow leading-snug text-ink-60">
              <strong className="text-ink">Observação:</strong> Entregar com a portaria do
              prédio.
            </div>
          </Card>

          <Card title="Pagamento">
            <div className="mb-3.5 flex items-center gap-3">
              <Icon name="creditCard" size={20} />
              <div className="flex-1">
                <div className="text-body-sm font-medium">Cartão Visa · final 4291</div>
                <div className="font-mono text-[10px] text-ink-60">
                  Em 6x de R$ 81,48 sem juros
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-eyebrow text-ink-60">
              <div className="flex justify-between">
                <span>Autorização</span>
                <span className="font-mono text-ink">#AUTH-7841221</span>
              </div>
              <div className="flex justify-between">
                <span>NSU</span>
                <span className="font-mono text-ink">889124</span>
              </div>
              <div className="flex justify-between">
                <span>Aprovado em</span>
                <span className="text-ink">15 mai · 14h33</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              className="mt-4 !text-sale"
            >
              Solicitar estorno
            </Button>
          </Card>

          <Card title="Envio">
            <div className="flex flex-col gap-2 text-body-sm">
              <div className="flex justify-between">
                <span className="text-ink-60">Modalidade</span>
                <span>SEDEX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-60">Prazo</span>
                <span>2 a 4 dias úteis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-60">Código de rastreio</span>
                <span className="font-mono text-ink-40">—</span>
              </div>
            </div>
            <input placeholder="Inserir código de rastreio" className="mt-4" />
          </Card>
        </div>
      </div>
    </>
  );
}
