import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { SettingsGroupForm } from '@/components/admin/forms/settings-form';
import { getAdminToken } from '@/lib/auth/admin-session';
import { getAllSettings, type AllSettings } from '@/lib/api/endpoints/admin-extras';

export const metadata: Metadata = { title: 'Configurações — Mabruk Admin' };

export default async function SettingsPage() {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const all: AllSettings = await getAllSettings(token).catch<AllSettings>(() => ({}));

  return (
    <>
      <AdminPageHeader subtitle="Sistema" title="Configurações" />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <SettingsGroupForm
          group="store"
          title="Identidade da loja"
          values={all.store ?? {}}
          fields={[
            { key: 'name', label: 'Nome da loja', type: 'text' },
            { key: 'slogan', label: 'Slogan', type: 'text', optional: true },
            { key: 'contactEmail', label: 'E-mail de contato', type: 'email' },
            { key: 'whatsapp', label: 'WhatsApp', type: 'tel', optional: true },
            { key: 'instagram', label: 'Instagram', type: 'text', optional: true },
          ]}
        />

        <SettingsGroupForm
          group="fiscal"
          title="Dados fiscais"
          values={all.fiscal ?? {}}
          fields={[
            { key: 'razaoSocial', label: 'Razão social', type: 'text' },
            { key: 'cnpj', label: 'CNPJ', type: 'text' },
            { key: 'inscricaoEstadual', label: 'Inscrição estadual', type: 'text', optional: true },
            { key: 'endereco', label: 'Endereço comercial', type: 'textarea' },
          ]}
        />

        <SettingsGroupForm
          group="shipping"
          title="Frete"
          values={all.shipping ?? {}}
          fields={[
            { key: 'freeShippingThresholdCents', label: 'Frete grátis acima de (centavos)', type: 'number' },
            { key: 'originZip', label: 'CEP de origem', type: 'text' },
          ]}
        />

        <SettingsGroupForm
          group="payment"
          title="Pagamento"
          values={all.payment ?? {}}
          fields={[
            { key: 'maxInstallments', label: 'Parcelas sem juros (máx)', type: 'number' },
            { key: 'pixDiscountPercent', label: 'Desconto PIX (%)', type: 'number', optional: true },
          ]}
        />
      </div>
    </>
  );
}
