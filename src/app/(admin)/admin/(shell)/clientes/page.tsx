import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Icon } from '@/components/ui/icon';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminCustomers } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Clientes — Mabruk Admin' };

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function CustomersListPage({ searchParams }: Props) {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const { search } = await searchParams;
  const { items, total } = await listAdminCustomers(token, {
    search,
    pageSize: 50,
  }).catch(() => ({ items: [], total: 0 }));

  return (
    <>
      <AdminPageHeader subtitle="Audiência" title="Clientes" />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <div className="border border-line bg-paper">
          <div className="flex items-center gap-4 border-b border-line px-4 py-3.5">
            <div className="text-body-sm">
              <span className="font-medium">{total}</span>{' '}
              <span className="text-ink-60">
                {total === 1 ? 'cliente' : 'clientes'} cadastrado
                {total === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="px-5 py-16 text-center text-body-sm text-ink-60">
              Nenhum cliente ainda.
            </div>
          ) : (
            <>
              <div
                className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
                style={{ gridTemplateColumns: '1fr 1.2fr 1fr 140px 40px' }}
              >
                <span>Cliente</span>
                <span>E-mail</span>
                <span>Telefone</span>
                <span>Cadastrado</span>
                <span />
              </div>

              {items.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/clientes/${c.id}` as Route}
                  className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm hover:bg-cream/40 lg:gap-4 lg:grid-cols-[1fr_1.2fr_1fr_140px_40px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-cream text-eyebrow font-semibold text-ink">
                      {initials(c.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{c.name}</div>
                    </div>
                  </div>
                  <span className="truncate text-body-sm text-ink-80">{c.email}</span>
                  <span className="text-body-sm text-ink-60">
                    {c.phone ? <span className="font-mono">{c.phone}</span> : '—'}
                  </span>
                  <span className="text-eyebrow text-ink-60">{formatDate(c.createdAt)}</span>
                  <Icon name="chevronRight" size={14} className="text-ink-60" />
                </Link>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
