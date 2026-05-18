import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Icon } from '@/components/ui/icon';
import { LandingForm } from '@/components/admin/forms/landing-form';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminLandings } from '@/lib/api/endpoints/admin-extras';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LandingEditPage({ params }: Props) {
  const { id } = await params;
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const isNew = id === 'nova';
  let landing = null;
  if (!isNew) {
    const all = await listAdminLandings(token).catch(() => []);
    landing = all.find((l) => l.id === id) ?? null;
  }

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/landings' as Route} className="hover:text-ink">
              Landings
            </Link>
            <Icon name="chevronRight" size={10} />
            <span>{isNew ? 'Nova' : 'Editar'}</span>
          </span>
        }
        title={landing?.name ?? 'Nova landing'}
      />
      <LandingForm landing={landing} />
    </>
  );
}
