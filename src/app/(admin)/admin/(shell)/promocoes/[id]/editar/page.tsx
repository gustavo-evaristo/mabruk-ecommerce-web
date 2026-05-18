import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Icon } from '@/components/ui/icon';
import { PromotionForm } from '@/components/admin/forms/promotion-form';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminPromotions } from '@/lib/api/endpoints/admin-extras';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PromotionEditPage({ params }: Props) {
  const { id } = await params;
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const isNew = id === 'nova';
  let promotion = null;
  if (!isNew) {
    const all = await listAdminPromotions(token).catch(() => []);
    promotion = all.find((p) => p.id === id) ?? null;
  }

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/promocoes' as Route} className="hover:text-ink">
              Promoções
            </Link>
            <Icon name="chevronRight" size={10} />
            <span>{isNew ? 'Nova' : 'Editar'}</span>
          </span>
        }
        title={promotion?.name ?? 'Nova promoção'}
      />
      <PromotionForm promotion={promotion} />
    </>
  );
}
