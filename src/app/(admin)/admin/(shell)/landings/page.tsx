import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminLandings } from '@/lib/api/endpoints/admin-extras';

export const metadata: Metadata = { title: 'Landings — Mabruk Admin' };

const STATUS_PILL: Record<string, string> = {
  PUBLISHED: 'bg-[rgba(61,106,78,0.1)] text-success',
  DRAFT: 'bg-[rgba(168,148,111,0.12)] text-champagne-dark',
  ARCHIVED: 'bg-cream text-ink-60',
};

export default async function LandingsListPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const items = await listAdminLandings(token).catch(() => []);

  return (
    <>
      <AdminPageHeader
        subtitle="Conteúdo"
        title="Landing pages"
        action={
          <Link href={'/admin/landings/nova/editar' as Route}>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              Nova landing
            </Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-10">
        <div className="border border-line bg-paper">
          {items.length === 0 ? (
            <div className="px-5 py-16 text-center text-body-sm text-ink-60">
              Nenhuma landing criada ainda.
            </div>
          ) : (
            items.map((l) => (
              <Link
                key={l.id}
                href={`/admin/landings/${l.id}/editar` as Route}
                className="grid items-center gap-4 border-b border-line px-5 py-4 text-body-sm last:border-0 hover:bg-cream/40 lg:grid-cols-[1fr_1fr_120px_120px_40px]"
              >
                <div className="font-medium">{l.name}</div>
                <span className="font-mono text-eyebrow text-ink-80">/{l.slug}</span>
                <span className="text-eyebrow text-ink-60">
                  {l.blocks.length} {l.blocks.length === 1 ? 'bloco' : 'blocos'}
                </span>
                <span
                  className={`inline-flex self-start px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                    STATUS_PILL[l.status]
                  }`}
                >
                  {l.status}
                </span>
                <Icon name="chevronRight" size={14} className="text-ink-60" />
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
