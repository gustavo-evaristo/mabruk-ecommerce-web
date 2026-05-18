import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { OrdersTable } from '@/components/admin/orders/orders-table';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminOrders } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Pedidos — Mabruk Admin' };

export default async function OrdersListPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const initialData = await listAdminOrders(token, { pageSize: 30 }).catch(() => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 30,
  }));

  return (
    <>
      <AdminPageHeader
        subtitle="Operações"
        title="Pedidos"
        action={
          <Button variant="secondary" size="md" icon={<Icon name="upload" size={14} />}>
            Exportar
          </Button>
        }
      />
      <div className="p-6 lg:p-10">
        <OrdersTable token={token} initialData={initialData} />
      </div>
    </>
  );
}
