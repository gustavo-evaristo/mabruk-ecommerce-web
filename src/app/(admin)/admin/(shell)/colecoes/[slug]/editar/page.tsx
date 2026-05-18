import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Icon } from '@/components/ui/icon';
import { CollectionForm } from '@/components/admin/forms/collection-form';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminCollections } from '@/lib/api/endpoints/admin';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CollectionEditPage({ params }: Props) {
  const { slug } = await params;
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const isNew = slug === 'nova';
  let collection = null;
  if (!isNew) {
    const all = await listAdminCollections(token).catch(() => []);
    collection = all.find((c) => c.slug === slug) ?? null;
    if (!collection) {
      // Slug não existe — vira modo "novo" usando o slug pré-preenchido
      collection = null;
    }
  }

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/colecoes' as Route} className="hover:text-ink">
              Coleções
            </Link>
            <Icon name="chevronRight" size={10} />
            <span>{isNew ? 'Nova' : 'Editar'}</span>
          </span>
        }
        title={collection?.name ?? 'Nova coleção'}
      />
      <CollectionForm collection={collection} />
    </>
  );
}
