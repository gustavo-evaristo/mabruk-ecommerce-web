import Link from 'next/link';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card, TierBadge } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_CUSTOMERS } from '@/lib/mock/admin';

interface Props {
  params: Promise<{ id: string }>;
}

const ORDERS = [
  { id: 'MAB-04812', date: '15 mai', items: 2, total: 48890, status: 'Em preparação' },
  { id: 'MAB-04567', date: '02 abr', items: 1, total: 32900, status: 'Entregue' },
  { id: 'MAB-04321', date: '14 fev', items: 4, total: 72950, status: 'Entregue' },
  { id: 'MAB-04102', date: '24 dez', items: 1, total: 21900, status: 'Entregue' },
];

const ACTIVITY = [
  { action: 'Adicionou peça aos favoritos', detail: 'Anel Trinity Dourado', time: 'há 1h' },
  { action: 'Visitou página de coleção', detail: 'Coleção Oásis', time: 'há 2h' },
  { action: 'Abriu e-mail de novidades', detail: 'Newsletter · maio', time: 'ontem' },
  { action: 'Realizou pedido', detail: 'MAB-04812 · R$ 488,90', time: 'há 2 dias' },
];

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const c = ADMIN_CUSTOMERS.find((it) => it.id === id);
  return { title: `${c?.name ?? 'Cliente'} — Mabruk Admin` };
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const c = ADMIN_CUSTOMERS.find((it) => it.id === id) ?? ADMIN_CUSTOMERS[0];

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/clientes' as Route} className="hover:text-ink">
              Clientes
            </Link>
            <Icon name="chevronRight" size={10} />
            <span>Detalhe</span>
          </span>
        }
        title={c.name}
        action={
          <>
            <Button variant="secondary" size="md">Enviar e-mail</Button>
            <Button variant="primary" size="md">Aplicar cupom</Button>
          </>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[320px_1fr] lg:p-10">
        <aside className="flex flex-col gap-4">
          <div className="border border-line bg-paper p-6 text-center">
            <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-ink font-display text-h5 font-medium text-paper">
              {c.initials}
            </div>
            <div className="font-display text-h6">{c.name}</div>
            <div className="mt-1 text-body-sm text-ink-60">
              {c.city} · {c.state}
            </div>
            <div className="mt-3 inline-flex">
              <TierBadge tier={c.tier} />
            </div>
          </div>

          <div className="border border-line bg-paper p-6">
            <div className="mb-3.5 text-[10px] font-medium uppercase tracking-eyebrow-lg text-ink-60">
              Contato
            </div>
            <div className="flex flex-col gap-2.5 text-body-sm">
              <div>
                <div className="text-ink-60">E-mail</div>
                <div className="font-mono text-eyebrow">{c.email}</div>
              </div>
              <div>
                <div className="text-ink-60">Telefone</div>
                <div className="font-mono">{c.phone}</div>
              </div>
              <div>
                <div className="text-ink-60">CPF</div>
                <div className="font-mono">328.***.***-22</div>
              </div>
            </div>
          </div>

          <div className="border border-line bg-paper p-6">
            <div className="mb-3.5 text-[10px] font-medium uppercase tracking-eyebrow-lg text-ink-60">
              Preferências
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Colares', 'Ouro 18k', 'Coleção Oásis'].map((t) => (
                <span key={t} className="bg-cream px-2.5 py-1 text-eyebrow">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: 'Total gasto', value: formatMoney(c.ltv) },
              { label: 'Pedidos', value: String(c.orders) },
              { label: 'Ticket médio', value: formatMoney(Math.round(c.ltv / c.orders)) },
              { label: 'Cliente desde', value: 'jan/2025' },
            ].map((s) => (
              <div key={s.label} className="border border-line bg-paper p-5">
                <div className="text-[9px] font-medium uppercase tracking-eyebrow text-ink-60">
                  {s.label}
                </div>
                <div className="mt-1 font-display text-h5 font-normal">{s.value}</div>
              </div>
            ))}
          </div>

          <Card
            title="Histórico de pedidos"
            action={
              <Link
                href={'/admin/pedidos' as Route}
                className="text-eyebrow uppercase tracking-eyebrow"
              >
                Ver todos →
              </Link>
            }
            bodyClassName="!p-0"
          >
            {ORDERS.map((o) => (
              <div
                key={o.id}
                className="grid items-center gap-4 border-b border-line px-6 py-3.5 text-body-sm last:border-0"
                style={{ gridTemplateColumns: '120px 80px 1fr 100px 120px 40px' }}
              >
                <span className="font-mono">{o.id}</span>
                <span className="text-eyebrow text-ink-60">{o.date}</span>
                <span className="text-body-sm text-ink-80">
                  {o.items} {o.items > 1 ? 'itens' : 'item'}
                </span>
                <span className="text-right font-mono font-medium">
                  {formatMoney(o.total)}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-eyebrow ${
                    o.status === 'Entregue' ? 'text-success' : 'text-ink-60'
                  }`}
                >
                  {o.status}
                </span>
                <Icon name="chevronRight" size={12} className="text-ink-60" />
              </div>
            ))}
          </Card>

          <Card title="Atividade recente">
            <div className="flex flex-col gap-3">
              {ACTIVITY.map((a, i) => (
                <div
                  key={i}
                  className={`flex gap-3 text-body-sm ${
                    i < ACTIVITY.length - 1 ? 'border-b border-line pb-3' : ''
                  }`}
                >
                  <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink-20" />
                  <div className="flex-1">
                    <strong>{a.action}</strong> ·{' '}
                    <span className="text-ink-60">{a.detail}</span>
                  </div>
                  <div className="text-[10px] text-ink-60">{a.time}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
