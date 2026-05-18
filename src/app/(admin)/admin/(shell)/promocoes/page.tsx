import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminPromotions, type AdminPromotion } from '@/lib/api/endpoints/admin-extras';

export const metadata: Metadata = { title: 'Promoções — Mabruk Admin' };

const STATUS_PILL: Record<AdminPromotion['status'], string> = {
  ACTIVE: 'bg-[rgba(61,106,78,0.1)] text-success',
  SCHEDULED: 'bg-ink text-paper',
  EXPIRED: 'bg-cream text-ink-60',
  PAUSED: 'bg-[rgba(168,148,111,0.14)] text-champagne-dark',
};

function discountLabel(p: AdminPromotion): string {
  if (p.discountType === 'PERCENT') return `${p.discountValue}% off`;
  if (p.discountType === 'FIXED_CENTS')
    return `${(p.discountValue / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} off`;
  return 'Frete grátis';
}

export default async function PromotionsPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const all = await listAdminPromotions(token).catch(() => []);
  const campaigns = all.filter((p) => p.type === 'CAMPAIGN');
  const coupons = all.filter((p) => p.type === 'COUPON');
  const rules = all.filter((p) => p.type === 'RULE');

  return (
    <>
      <AdminPageHeader
        subtitle="Marketing"
        title="Promoções e cupons"
        action={
          <Link href={'/admin/promocoes/nova/editar' as Route}>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              Nova
            </Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-8 p-6 lg:p-10">
        <Section title="Cupons" items={coupons} />
        <Section title="Campanhas" items={campaigns} />
        <Section title="Regras automáticas" items={rules} />
      </div>
    </>
  );
}

function Section({ title, items }: { title: string; items: AdminPromotion[] }) {
  return (
    <div className="border border-line bg-paper">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <div className="text-body-sm font-semibold">{title}</div>
        <div className="text-eyebrow text-ink-60">
          {items.length} {items.length === 1 ? 'item' : 'itens'}
        </div>
      </div>
      {items.length === 0 ? (
        <div className="px-5 py-10 text-center text-body-sm text-ink-60">
          Nenhum item neste grupo.
        </div>
      ) : (
        items.map((p) => (
          <Link
            key={p.id}
            href={`/admin/promocoes/${p.id}/editar` as Route}
            className="grid items-center gap-3 border-b border-line px-5 py-4 text-body-sm last:border-0 hover:bg-cream/40 lg:grid-cols-[1fr_120px_140px_140px_120px_40px]"
          >
            <div>
              <div className="font-medium">{p.name}</div>
              {p.code && (
                <div className="mt-0.5 font-mono inline-flex bg-cream px-2 py-0.5 text-eyebrow font-semibold">
                  {p.code}
                </div>
              )}
              {p.description && (
                <div className="mt-1 text-eyebrow text-ink-60">{p.description}</div>
              )}
            </div>
            <span className="font-medium">{discountLabel(p)}</span>
            <span className="text-eyebrow text-ink-60">{p.scope}</span>
            <span className="font-mono text-eyebrow">
              {p.usesCount}
              {p.usesMax ? ` / ${p.usesMax}` : ''}
            </span>
            <span
              className={`inline-flex self-start px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                STATUS_PILL[p.status]
              }`}
            >
              {p.status}
            </span>
            <Icon name="chevronRight" size={14} className="text-ink-60" />
          </Link>
        ))
      )}
    </div>
  );
}
