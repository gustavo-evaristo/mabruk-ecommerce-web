import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { CustomersTable } from '@/components/admin/customers/customers-table';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminCustomers } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Clientes — Mabruk Admin' };

export default async function CustomersListPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const initialData = await listAdminCustomers(token, { pageSize: 50 }).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <>
      <AdminPageHeader subtitle="Audiência" title="Clientes" />
      <div className="p-6 lg:p-10">
        <CustomersTable token={token} initialData={initialData} />
      </div>
    </>
  );
}
