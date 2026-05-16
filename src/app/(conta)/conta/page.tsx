import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';

const STATS = [
  { label: 'Total de pedidos', value: '4', sub: 'desde jan/2025' },
  { label: 'Total investido', value: 'R$ 1.766', sub: 'em 4 pedidos' },
  { label: 'Favoritos', value: '6', sub: 'peças salvas' },
];

const LAST_ORDER = {
  number: 'MAB-04812',
  status: 'Em preparação',
  totalCents: 48890,
  items: 2,
  payment: 'Cartão · 6x',
};

const TIMELINE = [
  { icon: 'check', label: 'Pago', date: '15 mai', done: true },
  { icon: 'pkg', label: 'Preparando', date: 'agora', done: true, active: true },
  { icon: 'truck', label: 'Enviado', date: 'até 16 mai', done: false },
  { icon: 'home', label: 'Entregue', date: '19-21 mai', done: false },
] as const;

const SHORTCUTS = [
  {
    href: '/conta/favoritos' as Route,
    icon: 'heart' as const,
    title: 'Favoritos',
    desc: '6 peças salvas. Anel Trinity acabou de voltar ao estoque.',
  },
  {
    href: '/conta/enderecos' as Route,
    icon: 'map' as const,
    title: 'Endereços',
    desc: '2 endereços cadastrados. Casa é seu endereço principal.',
  },
  {
    href: '/conta/dados' as Route,
    icon: 'user' as const,
    title: 'Dados pessoais',
    desc: 'Mantenha seus dados atualizados para receber seus pedidos.',
  },
];

export default function ContaOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-h3">Visão geral</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          Resumo da sua conta e atividades recentes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="border border-line bg-paper p-6">
            <div className="eyebrow">{s.label}</div>
            <div className="mt-2 font-display text-h3">{s.value}</div>
            <div className="mt-1 text-body-xs text-ink-60">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Último pedido */}
      <div className="border border-line bg-paper p-7">
        <div className="flex items-start justify-between">
          <div>
            <div className="eyebrow">Último pedido</div>
            <div className="mt-1.5 font-display text-h5">
              Pedido <span className="font-mono nums">{LAST_ORDER.number}</span>
            </div>
          </div>
          <span className="bg-cream px-3.5 py-1.5 text-eyebrow-sm font-medium uppercase tracking-eyebrow text-ink-60">
            {LAST_ORDER.status}
          </span>
        </div>

        <div className="relative mt-6 mb-6 grid grid-cols-4 gap-2">
          <div className="absolute top-3.5 right-[12%] left-[12%] h-px bg-line" />
          {TIMELINE.map((st) => (
            <div key={st.label} className="relative z-10 flex flex-col items-center">
              <div
                className={`grid size-7 place-items-center rounded-full border ${st.done ? 'border-ink bg-ink text-cream' : 'border-line bg-paper text-ink-40'}`}
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
            {LAST_ORDER.items} {LAST_ORDER.items > 1 ? 'itens' : 'item'} · {LAST_ORDER.payment}
            <div className="mt-1 font-mono nums text-body-md text-ink">
              {formatMoney(LAST_ORDER.totalCents)}
            </div>
          </div>
          <Link href={`/conta/pedidos/${LAST_ORDER.number}` as Route}>
            <Button variant="secondary" size="sm" iconRight={<Icon name="arrowRight" size={12} />}>
              Ver detalhes
            </Button>
          </Link>
        </div>
      </div>

      {/* Atalhos */}
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
