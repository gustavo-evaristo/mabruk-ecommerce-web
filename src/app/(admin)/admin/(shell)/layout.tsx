import type { ReactNode } from 'react';
import { AdminSidebar, AdminTopbar } from '@/components/admin/shell';

export default function AdminShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-screen grid-cols-[240px_1fr] bg-cream">
      <AdminSidebar />
      <main className="flex h-screen flex-col overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
