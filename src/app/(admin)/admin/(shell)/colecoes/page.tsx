import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_COLLECTIONS } from '@/lib/mock/admin';

export const metadata: Metadata = { title: 'Coleções — Mabruk Admin' };

export default function CollectionsListPage() {
  return (
    <>
      <AdminPageHeader
        subtitle="Conteúdo"
        title="Coleções"
        action={
          <>
            <Button variant="secondary" size="md">Reordenar</Button>
            <Link href={'/admin/colecoes/oasis/editar' as Route}>
              <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
                Nova coleção
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 p-6 lg:grid-cols-2 lg:p-10">
        {ADMIN_COLLECTIONS.map((c) => {
          const isDraft = c.status === 'rascunho';
          return (
            <Link
              key={c.id}
              href={`/admin/colecoes/${c.slug}/editar` as Route}
              className="liftable grid grid-cols-[180px_1fr] overflow-hidden border border-line bg-paper"
            >
              <div className="relative">
                <Image
                  src={c.coverImageUrl}
                  alt={c.name}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
                {isDraft && (
                  <div className="absolute inset-0 grid place-items-center bg-cream/70 text-eyebrow font-semibold uppercase tracking-eyebrow-lg">
                    Rascunho
                  </div>
                )}
              </div>
              <div className="flex flex-col p-6">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-eyebrow-lg text-ink-60">
                      Coleção
                    </div>
                    <div className="mt-1 font-display text-h5">{c.name}</div>
                  </div>
                  <span
                    className={`relative inline-block h-5 w-9 rounded-full ${
                      isDraft ? 'bg-ink-20' : 'bg-success'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 size-4 rounded-full bg-paper ${
                        isDraft ? 'left-0.5' : 'left-4.5'
                      }`}
                    />
                  </span>
                </div>
                <p className="my-2 flex-1 text-body-sm leading-relaxed text-ink-60">
                  {c.description}
                </p>
                <div className="mt-4 flex items-end gap-6 border-t border-line pt-4">
                  <div>
                    <div className="text-[9px] font-medium uppercase tracking-eyebrow text-ink-60">
                      Peças
                    </div>
                    <div className="mt-0.5 font-display text-lead">{c.productCount}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-medium uppercase tracking-eyebrow text-ink-60">
                      Atualizada
                    </div>
                    <div className="mt-0.5 font-display text-lead">{c.updatedAt}</div>
                  </div>
                  <div className="ml-auto flex gap-1.5">
                    {(['eye', 'edit', 'trash'] as const).map((name) => (
                      <span
                        key={name}
                        className="grid size-8 place-items-center bg-cream"
                      >
                        <Icon name={name} size={14} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
