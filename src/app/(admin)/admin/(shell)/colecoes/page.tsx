import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminCollections } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Coleções — Mabruk Admin' };

export default async function CollectionsListPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const collections = await listAdminCollections(token).catch(() => []);

  return (
    <>
      <AdminPageHeader
        subtitle="Conteúdo"
        title="Coleções"
        action={
          <Link href={'/admin/colecoes/nova/editar' as Route}>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              Nova coleção
            </Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-10">
        {collections.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-dashed border-line bg-paper py-16 text-center">
            <Icon name="grid" size={36} className="text-ink-40" />
            <h3 className="font-display text-h5">Nenhuma coleção ainda</h3>
            <p className="max-w-sm text-body-sm text-ink-60">
              Crie sua primeira coleção pra agrupar peças que contam uma história.
            </p>
            <Link href={'/admin/colecoes/nova/editar' as Route}>
              <Button variant="primary" size="sm" icon={<Icon name="plus" size={12} />}>
                Criar primeira coleção
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {collections.map((c) => (
              <Link
                key={c.id}
                href={`/admin/colecoes/${c.slug}/editar` as Route}
                className="liftable grid grid-cols-[180px_1fr] overflow-hidden border border-line bg-paper"
              >
                <div className="relative bg-cream">
                  {c.coverImageUrl && (
                    <Image
                      src={c.coverImageUrl}
                      alt={c.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                    />
                  )}
                  {!c.isActive && (
                    <div className="absolute inset-0 grid place-items-center bg-cream/70 text-eyebrow font-semibold uppercase tracking-eyebrow-lg">
                      Rascunho
                    </div>
                  )}
                </div>
                <div className="flex flex-col p-6">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-eyebrow-lg text-ink-60">
                      Coleção
                    </div>
                    <div className="mt-1 font-display text-h5">{c.name}</div>
                    <div className="mt-0.5 font-mono text-eyebrow text-ink-60">/{c.slug}</div>
                  </div>
                  {c.description && (
                    <p className="mt-2 flex-1 text-body-sm leading-relaxed text-ink-60">
                      {c.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`inline-flex self-start px-2.5 py-1 text-[10px] tracking-wide ${
                        c.isActive
                          ? 'bg-[rgba(61,106,78,0.1)] text-success'
                          : 'bg-cream text-ink-60'
                      }`}
                    >
                      {c.isActive ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
