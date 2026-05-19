import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { CategoryManager } from '@/components/admin/forms/category-manager';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminCategories } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Categorias — Mabruk Admin' };

export default async function CategoriesPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const categories = await listAdminCategories(token).catch(() => []);

  return (
    <>
      <AdminPageHeader subtitle="Catálogo" title="Categorias" />
      <div className="p-6 lg:p-10">
        <CategoryManager categories={categories} />
      </div>
    </>
  );
}
