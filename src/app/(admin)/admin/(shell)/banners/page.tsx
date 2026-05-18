import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminBanners } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Banners — Mabruk Admin' };

export default async function BannersListPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const banners = await listAdminBanners(token).catch(() => []);

  return (
    <>
      <AdminPageHeader
        subtitle="Conteúdo"
        title="Banners"
        action={
          <Link href={'/admin/banners/novo/editar' as Route}>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              Novo banner
            </Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-10">
        {banners.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-dashed border-line bg-paper py-16 text-center">
            <Icon name="eye" size={36} className="text-ink-40" />
            <h3 className="font-display text-h5">Nenhum banner cadastrado</h3>
            <p className="max-w-sm text-body-sm text-ink-60">
              Banners aparecem no header e na home do site B2C.
            </p>
            <Link href={'/admin/banners/novo/editar' as Route}>
              <Button variant="primary" size="sm" icon={<Icon name="plus" size={12} />}>
                Criar primeiro banner
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {banners.map((b) => (
              <Link
                key={b.id}
                href={`/admin/banners/${b.id}/editar` as Route}
                className="liftable overflow-hidden border border-line bg-paper"
              >
                <div className="relative aspect-[21/9] bg-cream">
                  <Image
                    src={b.imageUrl}
                    alt={b.alt ?? ''}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-medium uppercase tracking-eyebrow-lg ${
                        b.isActive
                          ? 'bg-[rgba(61,106,78,0.1)] text-success'
                          : 'bg-cream text-ink-60'
                      }`}
                    >
                      {b.isActive ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-display text-h6">{b.alt ?? 'Sem título'}</div>
                  <div className="mt-1 text-eyebrow text-ink-60">
                    {b.linkUrl ? <span className="font-mono">{b.linkUrl}</span> : 'sem link'}
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
