import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { TagManager } from '@/components/admin/forms/tag-manager';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminTags } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Tags — Mabruk Admin' };

export default async function TagsPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const tags = await listAdminTags(token).catch(() => []);

  return (
    <>
      <AdminPageHeader subtitle="Catálogo" title="Tags" />
      <div className="p-6 lg:p-10">
        <TagManager tags={tags} />
      </div>
    </>
  );
}
