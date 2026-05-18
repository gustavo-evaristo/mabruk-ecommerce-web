import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProductsTable } from '@/components/admin/products/products-table';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminProducts } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Produtos — Mabruk Admin' };

export default async function ProductsListPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const initialData = await listAdminProducts(token, { pageSize: 50 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <>
      <AdminPageHeader
        subtitle="Catálogo"
        title="Produtos"
        action={
          <Link href={'/admin/produtos/novo/editar' as Route}>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              Novo produto
            </Button>
          </Link>
        }
      />
      <div className="p-6 lg:p-10">
        <ProductsTable token={token} initialData={initialData} />
      </div>
    </>
  );
}
