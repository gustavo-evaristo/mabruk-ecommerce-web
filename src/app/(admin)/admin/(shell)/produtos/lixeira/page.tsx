import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { TrashTable } from '@/components/admin/products/trash-table';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminTrashProducts } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Lixeira — Produtos — Mabruk Admin' };

export default async function ProductsTrashPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const data = await listAdminTrashProducts(token).catch(() => ({ items: [] }));

  return (
    <>
      <AdminPageHeader
        subtitle="Catálogo · Lixeira"
        title="Produtos na lixeira"
        action={
          <Link href={'/admin/produtos' as Route}>
            <Button variant="ghost" size="md" icon={<Icon name="arrowLeft" size={14} />}>
              Voltar para produtos
            </Button>
          </Link>
        }
      />
      <div className="p-6 lg:p-10">
        <p className="mb-4 text-body-sm text-ink-60">
          Produtos excluídos ficam aqui por 30 dias antes de serem apagados permanentemente. Você
          pode restaurar a qualquer momento dentro desse período.
        </p>
        <TrashTable items={data.items} />
      </div>
    </>
  );
}
