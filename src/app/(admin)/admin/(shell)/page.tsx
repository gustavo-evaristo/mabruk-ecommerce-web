import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StatusBadge, type OrderStatus } from '@/components/admin/ui';
import { RevenueChart } from '@/components/admin/charts/revenue-chart';
import { OrderStatusDonut } from '@/components/admin/charts/donut-chart';
import { FunnelChart } from '@/components/admin/charts/funnel-chart';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_ORDERS, ADMIN_PRODUCTS } from '@/lib/mock/admin';

export const metadata: Metadata = { title: 'Visão geral — Mabruk Admin' };

const KPIS = [
  { label: 'Receita', value: 'R$ 87.340', delta: '+18,4%', positive: true },
  { label: 'Pedidos', value: '284', delta: '+12,1%', positive: true },
  { label: 'Ticket médio', value: 'R$ 307', delta: '+5,8%', positive: true },
  { label: 'Conversão', value: '3,4%', delta: '-0,6%', positive: false },
  { label: 'Visitantes', value: '8.421', delta: '+9,2%', positive: true },
  { label: 'Carrinho ab.', value: '124', delta: '-3,1%', positive: false },
  { label: 'LTV médio', value: 'R$ 542', delta: '+4,1%', positive: true },
];

const PERIODS = ['Hoje', '7D', '30D', '90D', 'YTD'] as const;

const REVENUE_BREAKDOWN = [
  { label: 'Vendas brutas', value: 'R$ 87.340', sub: null },
  { label: 'Descontos', value: '- R$ 4.220', sub: '4,8%' },
  { label: 'Frete', value: 'R$ 2.140', sub: null },
  { label: 'Reembolsos', value: '- R$ 380', sub: '0,4%' },
];

const ALERTS = [
  { t: '12 pedidos aguardando pgto.', sub: '+24h sem confirmação', urgent: true },
  { t: '8 produtos estoque baixo', sub: 'Anel Trinity, Brinco Mira, +6', urgent: false },
  { t: '4 avaliações para moderar', sub: '2 com nota inferior a 4', urgent: false },
  { t: 'Cupom MAES26 expira', sub: 'Em 6 dias · 142 usos', urgent: false },
];

const CATEGORIES = [
  { name: 'Colares', value: 32480, pct: 37, count: 92 },
  { name: 'Brincos', value: 21340, pct: 24, count: 78 },
  { name: 'Anéis', value: 17220, pct: 20, count: 64 },
  { name: 'Pulseiras', value: 10180, pct: 12, count: 28 },
  { name: 'Conjuntos', value: 6120, pct: 7, count: 12 },
];

const TOP_PRODUCT_IMG =
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80';

export default function AdminDashboardPage() {
  return (
    <>
      <AdminPageHeader
        action={
          <>
            <div className="flex border border-line bg-paper">
              {PERIODS.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  className={`px-3 py-1.5 text-eyebrow tracking-wide ${
                    p === '30D'
                      ? 'bg-ink font-semibold text-paper'
                      : 'text-ink-60 hover:text-ink'
                  } ${i > 0 ? 'border-l border-line' : ''}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" icon={<Icon name="upload" size={12} />}>
              Exportar
            </Button>
            <Link href={'/admin/produtos/novo' as Route}>
              <Button variant="primary" size="sm" icon={<Icon name="plus" size={12} />}>
                Novo produto
              </Button>
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-4 p-6">
        {/* KPI rail */}
        <div className="grid grid-cols-2 border border-line bg-paper sm:grid-cols-4 lg:grid-cols-7">
          {KPIS.map((kpi, i) => (
            <div
              key={kpi.label}
              className={`px-5 py-4.5 ${i > 0 ? 'border-l border-line' : ''}`}
            >
              <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">
                {kpi.label}
              </div>
              <div className="mt-2 text-[20px] font-semibold tracking-tight whitespace-nowrap">
                {kpi.value}
              </div>
              <div
                className={`mt-1 text-eyebrow font-semibold ${
                  kpi.positive ? 'text-success' : 'text-sale'
                }`}
              >
                {kpi.positive ? '↑' : '↓'} {kpi.delta.replace(/^[+-]/, '')}
              </div>
            </div>
          ))}
        </div>

        {/* Hero row */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2.2fr_1fr]">
          {/* Revenue */}
          <div className="border border-line bg-paper">
            <div className="flex items-start justify-between border-b border-line px-7 py-5">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-eyebrow-lg text-ink-60">
                  Receita · maio 2026
                </div>
                <div className="mt-3 flex flex-wrap items-baseline gap-3.5">
                  <span className="text-[28px] font-semibold tracking-tight whitespace-nowrap">
                    R$ 87.340
                  </span>
                  <span className="text-body font-semibold text-success">
                    + R$ 13.580 (+18,4%)
                  </span>
                </div>
                <div className="mt-5 max-w-[480px]">
                  <div className="h-1.5 bg-cream">
                    <div className="h-full w-[73%] bg-ink" />
                  </div>
                  <div className="mt-1.5 flex justify-between text-eyebrow text-ink-60">
                    <span>R$ 32.660 para a meta</span>
                    <span className="font-semibold">73% de R$ 120k</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3.5">
                <div className="flex gap-4 text-[10px] text-ink-60">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="block h-0.5 w-3 bg-ink" /> Atual
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="block h-0.5 w-3 bg-ink-40"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, #9A938A 50%, transparent 50%)',
                        backgroundSize: '4px 2px',
                      }}
                    />{' '}
                    Anterior
                  </span>
                </div>
                <button type="button" className="text-ink-60 hover:text-ink">
                  <Icon name="settings" size={14} />
                </button>
              </div>
            </div>

            <div className="px-4 pt-2">
              <RevenueChart />
            </div>
            <div className="flex justify-between px-7 pb-3 text-[10px] text-ink-40">
              <span>1 mai</span>
              <span>7</span>
              <span>15</span>
              <span>22</span>
              <span>30</span>
            </div>

            <div className="grid grid-cols-2 border-t border-line sm:grid-cols-4">
              {REVENUE_BREAKDOWN.map((m, i) => (
                <div
                  key={m.label}
                  className={`px-5 py-4 ${i > 0 ? 'sm:border-l sm:border-line' : ''} ${
                    i > 0 && i % 2 !== 0 ? 'border-l border-line sm:border-l' : ''
                  }`}
                >
                  <div className="text-[10px] text-ink-60">{m.label}</div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[15px] font-semibold">{m.value}</span>
                    {m.sub && <span className="text-[10px] text-ink-60">{m.sub}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Needs attention */}
          <div className="flex flex-col bg-ink text-paper">
            <div className="flex items-center justify-between border-b border-paper/10 px-6 py-5">
              <div className="text-[10px] font-semibold uppercase tracking-eyebrow-lg text-paper/60">
                Requer atenção
              </div>
              <span className="bg-sale px-2 py-0.5 text-[10px] font-bold tracking-wide text-paper">
                4
              </span>
            </div>
            <div className="px-6 py-5">
              <div className="font-display text-[56px] leading-none font-normal tracking-tight">
                4 itens
              </div>
              <div className="mt-6 flex flex-col">
                {ALERTS.map((a, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`flex items-center justify-between gap-3 py-3 text-left ${
                      i > 0 ? 'border-t border-paper/10' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-body-sm font-medium">
                        {a.urgent && (
                          <span className="size-1.5 shrink-0 rounded-full bg-sale" />
                        )}
                        {a.t}
                      </div>
                      <div className="mt-0.5 text-[10px] text-paper/55">{a.sub}</div>
                    </div>
                    <Icon name="arrowRight" size={14} className="text-champagne" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modular grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
          {/* Donut */}
          <div className="border border-line bg-paper lg:col-span-4">
            <div className="flex items-start justify-between border-b border-line px-5 py-4">
              <div>
                <div className="text-body-sm font-semibold">Status dos pedidos</div>
                <div className="mt-0.5 text-[10px] text-ink-60">
                  68 abertos · 216 finalizados
                </div>
              </div>
              <Link
                href={'/admin/pedidos' as Route}
                className="text-[10px] uppercase tracking-eyebrow-lg text-ink-60"
              >
                Ver
              </Link>
            </div>
            <OrderStatusDonut />
          </div>

          {/* Funnel */}
          <div className="border border-line bg-paper lg:col-span-4">
            <div className="border-b border-line px-5 py-4">
              <div className="text-body-sm font-semibold">Funil de conversão</div>
              <div className="mt-0.5 text-[10px] text-ink-60">Últimos 30 dias</div>
            </div>
            <FunnelChart />
          </div>

          {/* Top product showcase */}
          <div className="relative flex flex-col overflow-hidden bg-ink text-paper lg:col-span-4">
            <div className="relative aspect-[4/2.2] overflow-hidden">
              <Image
                src={TOP_PRODUCT_IMG}
                alt="Colar Lumière"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-eyebrow-lg text-champagne">
                  #1 produto · maio
                </div>
                <div className="mt-2 font-display text-h5 font-normal">Colar Lumière</div>
                <div className="mt-1 text-eyebrow text-paper/60">
                  Coleção Oásis · banho ouro 18k
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-paper/15 pt-3.5">
                <div>
                  <div className="text-[9px] uppercase tracking-eyebrow text-paper/50">
                    Vendas
                  </div>
                  <div className="mt-0.5 text-lead font-semibold">42</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-eyebrow text-paper/50">
                    Receita
                  </div>
                  <div className="mt-0.5 text-lead font-semibold">R$ 12.138</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-eyebrow text-paper/50">
                    Estoque
                  </div>
                  <div className="mt-0.5 text-lead font-semibold text-champagne">14</div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border border-line bg-paper lg:col-span-7">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="text-body-sm font-semibold">Vendas por categoria</div>
              <Link
                href={'/admin/produtos' as Route}
                className="text-[10px] uppercase tracking-eyebrow-lg text-ink-60"
              >
                Detalhes
              </Link>
            </div>
            <div className="flex flex-col gap-3 p-5">
              {CATEGORIES.map((c) => (
                <div
                  key={c.name}
                  className="grid items-center gap-3 text-body-sm"
                  style={{ gridTemplateColumns: '120px 1fr 100px 70px' }}
                >
                  <span className="font-medium">{c.name}</span>
                  <div className="h-2.5 bg-cream">
                    <div className="h-full bg-ink" style={{ width: `${c.pct}%` }} />
                  </div>
                  <span className="text-right font-semibold">{formatMoney(c.value * 100)}</span>
                  <span className="text-right text-body-xs text-ink-60">
                    {c.count} vendas
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top products list */}
          <div className="border border-line bg-paper lg:col-span-5">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="text-body-sm font-semibold">Top 5 produtos · 30 dias</div>
              <Link
                href={'/admin/produtos' as Route}
                className="text-[10px] uppercase tracking-eyebrow-lg text-ink-60"
              >
                Ver todos
              </Link>
            </div>
            <div>
              {ADMIN_PRODUCTS.slice(0, 5).map((p, i) => {
                const sold = 42 - i * 6;
                return (
                  <div
                    key={p.id}
                    className={`grid items-center gap-3 px-5 py-2.5 text-body-sm ${
                      i < 4 ? 'border-b border-line' : ''
                    }`}
                    style={{ gridTemplateColumns: '24px 36px 1fr 80px' }}
                  >
                    <span className="text-body-xs font-semibold text-ink-40">{i + 1}</span>
                    <div className="size-9 bg-cream" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="mt-0.5 text-[10px] text-ink-60">
                        {sold} vendas · {formatMoney(p.price)}
                      </div>
                    </div>
                    <span className="text-right font-semibold">
                      {formatMoney(sold * p.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent orders */}
        <div className="border border-line bg-paper">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5">
            <div className="flex items-center gap-4">
              <div className="text-body-sm font-semibold">Pedidos recentes</div>
              <div className="flex gap-1">
                {[
                  { id: 'all', label: 'Todos', count: 12, active: true },
                  { id: 'open', label: 'Em aberto', count: 5, active: false },
                  { id: 'paid', label: 'Pagos hoje', count: 3, active: false },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`px-2.5 py-1.5 text-body-xs ${
                      t.active
                        ? 'bg-cream font-semibold text-ink'
                        : 'text-ink-60 hover:text-ink'
                    }`}
                  >
                    {t.label}{' '}
                    <span className="text-[10px] opacity-50">{t.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <Link
              href={'/admin/pedidos' as Route}
              className="text-eyebrow font-medium tracking-wide text-ink"
            >
              Ver todos →
            </Link>
          </div>

          <div className="hidden bg-cream text-[10px] font-medium uppercase tracking-wide text-ink-60 md:grid"
            style={{ gridTemplateColumns: '110px 1fr 140px 100px 130px 60px 40px' }}>
            <span className="px-5 py-2.5">Pedido</span>
            <span className="py-2.5">Cliente</span>
            <span className="py-2.5">Pagamento</span>
            <span className="py-2.5 text-right">Total</span>
            <span className="py-2.5">Status</span>
            <span className="py-2.5 text-right">Há</span>
            <span />
          </div>

          {ADMIN_ORDERS.slice(0, 6).map((o) => (
            <Link
              key={o.id}
              href={`/admin/pedidos/${o.id}` as Route}
              className="grid items-center gap-4 border-b border-line px-5 py-3 text-body-sm last:border-0 hover:bg-cream/50 md:grid-cols-[110px_1fr_140px_100px_130px_60px_40px]"
            >
              <span className="font-mono font-semibold">{o.id}</span>
              <div>
                <div className="font-medium">{o.customer}</div>
                <div className="mt-0.5 text-[10px] text-ink-60">
                  {o.items} {o.items > 1 ? 'itens' : 'item'}
                </div>
              </div>
              <span className="text-body-xs text-ink-80">{o.payment}</span>
              <span className="font-mono font-semibold md:text-right">
                {formatMoney(o.total)}
              </span>
              <StatusBadge status={o.status as OrderStatus} />
              <span className="text-[10px] text-ink-60 md:text-right">há 12 min</span>
              <Icon name="chevronRight" size={14} className="hidden text-ink-40 md:block" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
