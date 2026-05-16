import Link from 'next/link';
import type { Route } from 'next';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { formatMoney } from '@/lib/utils/format';

const MOCK_ORDERS = [
  {
    number: 'MAB-04812',
    date: '15 mai 2026',
    status: 'preparando' as const,
    totalCents: 48890,
    items: 2,
    payment: 'Cartão · 6x',
    shipping: 'SEDEX · prev. 19-21 mai',
  },
  {
    number: 'MAB-04567',
    date: '02 abr 2026',
    status: 'entregue' as const,
    totalCents: 32900,
    items: 1,
    payment: 'PIX',
    shipping: 'Entregue em 06 abr',
  },
  {
    number: 'MAB-04321',
    date: '14 fev 2026',
    status: 'entregue' as const,
    totalCents: 72950,
    items: 4,
    payment: 'Cartão · 6x',
    shipping: 'Entregue em 18 fev',
  },
  {
    number: 'MAB-04102',
    date: '24 dez 2025',
    status: 'entregue' as const,
    totalCents: 21900,
    items: 1,
    payment: 'Cartão',
    shipping: 'Entregue em 24 dez',
  },
];

const STATUS_VARIANT: Record<
  string,
  { label: string; variant: 'default' | 'success' | 'sale' | 'line' }
> = {
  preparando: { label: 'Em preparação', variant: 'default' },
  enviado: { label: 'Enviado', variant: 'line' },
  entregue: { label: 'Entregue', variant: 'success' },
  cancelado: { label: 'Cancelado', variant: 'sale' },
};

export default function ContaPedidosPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-h3">Meus pedidos</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          {MOCK_ORDERS.length} pedidos · histórico completo da sua conta
        </p>
      </div>

      <div className="flex flex-col">
        {MOCK_ORDERS.map((o) => {
          const status = STATUS_VARIANT[o.status];
          return (
            <Link
              key={o.number}
              href={`/conta/pedidos/${o.number}` as Route}
              className="grid grid-cols-[1fr_auto] items-center gap-6 border-b border-line py-6 hover:bg-cream"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono nums text-body">#{o.number}</span>
                  <Tag variant={status.variant}>{status.label}</Tag>
                </div>
                <div className="mt-1.5 text-body-xs text-ink-60">
                  {o.date} · {o.items} {o.items > 1 ? 'itens' : 'item'} · {o.payment}
                </div>
                <div className="mt-1 text-body-xs text-ink-60">{o.shipping}</div>
              </div>
              <div className="text-right">
                <div className="font-mono nums text-body-md">{formatMoney(o.totalCents)}</div>
                <span className="mt-1 inline-flex items-center gap-1.5 text-eyebrow font-medium uppercase tracking-eyebrow text-ink">
                  Detalhes
                  <Icon name="arrowRight" size={11} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
