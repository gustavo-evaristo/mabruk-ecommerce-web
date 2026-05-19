import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { AttributeManager } from '@/components/admin/forms/attribute-manager';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminAttributes } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Atributos — Mabruk Admin' };

export default async function AttributesPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const attributes = await listAdminAttributes(token).catch(() => []);

  return (
    <>
      <AdminPageHeader
        subtitle="Catálogo"
        title="Atributos"
      />
      <div className="p-6 lg:p-10">
        <p className="mb-6 max-w-2xl text-body-sm text-ink-60">
          Atributos são reutilizáveis entre produtos. Cadastre uma vez (ex: <strong>Banho</strong>{' '}
          com valores Ouro 18k, Prata 925, Aço Inox) e use em vários produtos variáveis. Para o tipo{' '}
          <strong>Cor</strong>, cada valor pode ter um código hex que aparece como swatch na PDP.
        </p>
        <AttributeManager attributes={attributes} />
      </div>
    </>
  );
}
