import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { getAuthToken } from '@/lib/auth/session';
import { listMyOrders } from '@/lib/api/endpoints/orders';
import type { OrderStatus, OrderSummary } from '@/lib/api/types';

interface TimelineStep {
  icon: IconName;
  label: string;
  date: string;
  done: boolean;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  PAID: 'Pago',
  PREPARING: 'Em preparação',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
  REFUNDED: 'Reembolsado',
};

function buildTimeline(order: OrderSummary): TimelineStep[] {
  const passed = (...all: OrderStatus[]) => all.includes(order.status);
  return [
    {
      icon: 'check',
      label: 'Pago',
      date: passed('PAID', 'PREPARING', 'SHIPPED', 'DELIVERED') ? 'feito' : '—',
      done: passed('PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'),
    },
    {
      icon: 'pkg',
      label: 'Preparando',
      date: passed('PREPARING') ? 'em andamento' : passed('SHIPPED', 'DELIVERED') ? 'feito' : '—',
      done: passed('PREPARING', 'SHIPPED', 'DELIVERED'),
    },
    {
      icon: 'truck',
      label: 'Enviado',
      date: passed('SHIPPED') ? 'em trânsito' : passed('DELIVERED') ? 'feito' : '—',
      done: passed('SHIPPED', 'DELIVERED'),
    },
    {
      icon: 'home',
      label: 'Entregue',
      date: passed('DELIVERED') ? 'feito' : '—',
      done: passed('DELIVERED'),
    },
  ];
}

const SHORTCUTS = [
  {
    href: '/conta/favoritos' as Route,
    icon: 'heart' as const,
    title: 'Favoritos',
    desc: 'Suas peças favoritadas, prontas pra voltar quando quiser.',
  },
  {
    href: '/conta/enderecos' as Route,
    icon: 'map' as const,
    title: 'Endereços',
    desc: 'Cadastre os endereços de entrega que você mais usa.',
  },
  {
    href: '/conta/dados' as Route,
    icon: 'user' as const,
    title: 'Dados pessoais',
    desc: 'Mantenha seus dados atualizados para receber seus pedidos.',
  },
];

export default async function ContaOverviewPage() {
  const token = await getAuthToken();
  if (!token) redirect('/entrar');

  const { items, total } = await listMyOrders(token, { pageSize: 5 }).catch(() => ({
    items: [],
    total: 0,
  }));

  const lastOrder = items[0] ?? null;
  const investedCents = items.reduce((s, o) => s + o.grandTotalCents, 0);

  const stats = [
    { label: 'Total de pedidos', value: String(total), sub: total === 1 ? 'pedido' : 'pedidos' },
    {
      label: 'Total investido',
      value: total > 0 ? formatMoney(investedCents) : 'R$ 0,00',
      sub: `em ${items.length} ${items.length === 1 ? 'pedido' : 'pedidos'}`,
    },
    { label: 'Status', value: total > 0 ? 'Ativa' : 'Nova', sub: 'sua conta' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-h3">Visão geral</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          Resumo da sua conta e atividades recentes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-line bg-paper p-6">
            <div className="eyebrow">{s.label}</div>
            <div className="mt-2 font-display text-h3">{s.value}</div>
            <div className="mt-1 text-body-xs text-ink-60">{s.sub}</div>
          </div>
        ))}
      </div>

      {lastOrder ? (
        <div className="border border-line bg-paper p-7">
          <div className="flex items-start justify-between">
            <div>
              <div className="eyebrow">Último pedido</div>
              <div className="mt-1.5 font-display text-h5">
                Pedido <span className="font-mono nums">{lastOrder.number}</span>
              </div>
            </div>
            <span className="bg-cream px-3.5 py-1.5 text-eyebrow-sm font-medium uppercase tracking-eyebrow text-ink-60">
              {STATUS_LABEL[lastOrder.status]}
            </span>
          </div>

          <div className="relative mt-6 mb-6 grid grid-cols-4 gap-2">
            <div className="absolute top-3.5 right-[12%] left-[12%] h-px bg-line" />
            {buildTimeline(lastOrder).map((st) => (
              <div key={st.label} className="relative z-10 flex flex-col items-center">
                <div
                  className={`grid size-7 place-items-center rounded-full border ${
                    st.done ? 'border-ink bg-ink text-cream' : 'border-line bg-paper text-ink-40'
                  }`}
                >
                  <Icon name={st.icon} size={14} />
                </div>
                <div
                  className={`mt-2.5 text-body-xs font-medium ${st.done ? 'text-ink' : 'text-ink-60'}`}
                >
                  {st.label}
                </div>
                <div className="text-[10px] text-ink-60">{st.date}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-line pt-5">
            <div className="text-body-sm text-ink-60">
              <div className="mt-1 font-mono nums text-body-md text-ink">
                {formatMoney(lastOrder.grandTotalCents)}
              </div>
            </div>
            <Link href={`/conta/pedidos/${lastOrder.number}` as Route}>
              <Button
                variant="secondary"
                size="sm"
                iconRight={<Icon name="arrowRight" size={12} />}
              >
                Ver detalhes
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="border border-line bg-paper p-7 text-center">
          <div className="eyebrow">Último pedido</div>
          <p className="mt-3 text-body-sm text-ink-60">
            Você ainda não fez nenhum pedido por aqui.
          </p>
          <div className="mt-5">
            <Link href={'/' as Route}>
              <Button
                variant="primary"
                size="sm"
                iconRight={<Icon name="arrowRight" size={12} />}
              >
                Explorar peças
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="liftable flex items-start gap-4 border border-line bg-paper p-6"
          >
            <div className="grid size-10 shrink-0 place-items-center bg-cream">
              <Icon name={s.icon} size={16} />
            </div>
            <div>
              <div className="font-display text-body-xl">{s.title}</div>
              <div className="mt-1 text-body-xs text-ink-60">{s.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
