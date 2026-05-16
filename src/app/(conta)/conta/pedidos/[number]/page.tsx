import Link from 'next/link';
import type { Route } from 'next';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/lib/utils/format';

interface Props {
  params: Promise<{ number: string }>;
}

const TIMELINE: { icon: IconName; title: string; date: string; done: boolean }[] = [
  { icon: 'check', title: 'Pedido recebido', date: '15 mai 2026, 14:32', done: true },
  { icon: 'box', title: 'Pagamento confirmado', date: '15 mai 2026, 15:01', done: true },
  { icon: 'pkg', title: 'Preparando seu pedido', date: 'em andamento', done: true },
  { icon: 'truck', title: 'A caminho', date: 'até 16 mai', done: false },
  { icon: 'home', title: 'Entregue', date: 'previsão 19-21 mai', done: false },
];

export default async function OrderDetailsPage({ params }: Props) {
  const { number } = await params;
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
            Pedido <span className="font-mono nums">{number}</span>
          </h2>
          <Tag variant="default">Em preparação</Tag>
        </div>
        <p className="mt-1.5 text-body-sm text-ink-60">Realizado em 15 mai 2026 · 14:32</p>
      </div>

      <section>
        <h3 className="mb-5 font-display text-h5">Acompanhamento</h3>
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
            <Icon name="creditCard" size={18} />
            Cartão Visa · final 4291
          </div>
          <div className="mt-1.5 text-body-xs text-ink-60">
            6x de <span className="font-mono nums">{formatMoney(8148)}</span> sem juros
          </div>
        </div>
      </section>

      <section className="border-t border-line pt-8">
        <h3 className="mb-4 font-display text-h5">Itens</h3>
        <div className="flex flex-col divide-y divide-line">
          {[
            {
              name: 'Colar Pingente Lumière',
              variant: 'Ouro 18k · 45cm',
              qty: 1,
              unit: 28900,
              imageUrl:
                'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
            },
            {
              name: 'Brinco Argola Mira',
              variant: 'Ouro 18k · médio',
              qty: 1,
              unit: 16900,
              imageUrl:
                'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=400&q=80',
            },
          ].map((it) => (
            <div key={it.name} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 py-4">
              <img src={it.imageUrl} alt={it.name} className="aspect-[4/5] w-20 object-cover" />
              <div>
                <div className="font-display text-body-xl">{it.name}</div>
                <div className="text-body-xs text-ink-60">{it.variant}</div>
                <div className="mt-1 text-body-xs">
                  {it.qty} × <span className="font-mono nums">{formatMoney(it.unit)}</span>
                </div>
              </div>
              <div className="font-mono nums text-body-md">{formatMoney(it.unit * it.qty)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream p-6">
        <div className="flex flex-col gap-2 text-body-sm">
          <div className="flex justify-between">
            <span className="text-ink-60">Subtotal</span>
            <span className="font-mono nums">{formatMoney(45800)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-60">Frete (SEDEX)</span>
            <span className="font-mono nums">{formatMoney(2990)}</span>
          </div>
          <div className="my-2 h-px bg-ink/10" />
          <div className="flex items-baseline justify-between">
            <span className="text-body-md font-medium">Total</span>
            <span className="font-display text-h4">{formatMoney(48890)}</span>
          </div>
        </div>
      </section>

      <section className="flex gap-3">
        <Button variant="secondary" size="md" icon={<Icon name="truck" size={14} />}>
          Rastrear envio
        </Button>
        <Button variant="ghost" size="md" icon={<Icon name="bell" size={14} />}>
          Solicitar ajuda
        </Button>
      </section>
    </div>
  );
}
