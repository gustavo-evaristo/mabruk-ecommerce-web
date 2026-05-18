import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AdminSidebar, AdminTopbar } from '@/components/admin/shell';
import { getAdminToken } from '@/lib/auth/admin-session';
import { getAdminMe } from '@/lib/api/endpoints/admin-auth';

export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  let admin;
  try {
    admin = await getAdminMe(token);
  } catch {
    redirect('/admin/entrar');
  }

  return (
    <div className="grid h-screen grid-cols-[240px_1fr] bg-cream">
      <AdminSidebar admin={admin} />
      <main className="flex h-screen flex-col overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
