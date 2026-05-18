import Link from 'next/link';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { TierBadge } from '@/components/admin/ui';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_CUSTOMERS } from '@/lib/mock/admin';

export const metadata: Metadata = { title: 'Clientes — Mabruk Admin' };

const STATS = [
  { label: 'Total de clientes', value: '1.284', sub: '+ 84 este mês' },
  { label: 'Insiders', value: '347', sub: '27% da base' },
  { label: 'LTV médio', value: 'R$ 542', sub: '↑ 12% vs último tri' },
  { label: 'Taxa de retorno', value: '38%', sub: 'compra recorrente' },
];

const TABS = [
  { id: 'all', label: 'Todos', count: 1284, active: true },
  { id: 'diamond', label: 'Diamond', count: 47 },
  { id: 'insider', label: 'Insiders', count: 347 },
  { id: 'member', label: 'Membros', count: 890 },
  { id: 'inactive', label: 'Inativas (90d+)', count: 184 },
];

export default function CustomersListPage() {
  return (
    <>
      <AdminPageHeader
        subtitle="Audiência"
        title="Clientes"
        action={
          <>
            <Button variant="secondary" size="md" icon={<Icon name="upload" size={14} />}>
              Exportar
            </Button>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              Novo cliente
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border border-line bg-paper px-5 py-4.5">
              <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">
                {s.label}
              </div>
              <div className="mt-1.5 font-display text-h4 font-normal">{s.value}</div>
              <div className="mt-0.5 text-eyebrow text-ink-60">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="border border-line bg-paper">
          <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3.5">
            <div className="flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-body-sm ${
                    t.active
                      ? 'bg-cream font-medium text-ink'
                      : 'text-ink-60 hover:text-ink'
                  }`}
                >
                  {t.label}
                  <span className="font-mono text-[10px] text-ink-40">{t.count}</span>
                </button>
              ))}
            </div>
            <input
              placeholder="Buscar nome ou e-mail"
              className="ml-auto !h-9 !w-[240px] !text-body-sm"
            />
          </div>

          <div
            className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
            style={{
              gridTemplateColumns: '40px 1fr 1.2fr 1fr 80px 120px 120px 100px 40px',
            }}
          >
            <input type="checkbox" className="!w-auto !m-0" />
            <span>Cliente</span>
            <span>E-mail</span>
            <span>Cidade</span>
            <span className="text-right">Pedidos</span>
            <span className="text-right">LTV</span>
            <span>Último pedido</span>
            <span>Tier</span>
            <span />
          </div>

          {ADMIN_CUSTOMERS.map((c) => (
            <Link
              key={c.id}
              href={`/admin/clientes/${c.id}` as Route}
              className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm hover:bg-cream/40 lg:gap-4"
              style={{
                gridTemplateColumns: '40px 1fr 1.2fr 1fr 80px 120px 120px 100px 40px',
              }}
            >
              <input type="checkbox" className="!w-auto !m-0" />
              <div className="flex items-center gap-3">
                <div className="grid size-8 place-items-center rounded-full bg-cream text-eyebrow font-semibold text-ink">
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium">{c.name}</div>
                  <div className="text-[10px] text-ink-60">{c.phone}</div>
                </div>
              </div>
              <span className="truncate text-body-sm text-ink-80">{c.email}</span>
              <span className="text-body-sm text-ink-60">
                {c.city} · {c.state}
              </span>
              <span className="text-right font-mono">{c.orders}</span>
              <span className="text-right font-mono font-medium">
                {formatMoney(c.ltv)}
              </span>
              <span className="text-eyebrow text-ink-60">{c.lastOrderAt}</span>
              <TierBadge tier={c.tier} />
              <Icon name="chevronRight" size={14} className="text-ink-60" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
