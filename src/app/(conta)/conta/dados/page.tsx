import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { getAuthToken } from '@/lib/auth/session';
import { getCustomerMe } from '@/lib/api/endpoints/customers';
import { ProfileForm } from '@/components/account/profile-form';

export default async function DadosPessoaisPage() {
  const token = await getAuthToken();
  if (!token) redirect('/entrar');

  const customer = await getCustomerMe(token);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-h3">Dados pessoais</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          Mantenha seus dados atualizados para garantir entregas certeiras.
        </p>
      </div>

      <ProfileForm customer={customer} />

      <section className="border border-line p-6">
        <h3 className="font-display text-h5">Senha</h3>
        <p className="mt-1.5 text-body-sm text-ink-60">
          Altere sua senha para manter sua conta segura.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          icon={<Icon name="lock" size={12} />}
        >
          Alterar senha
        </Button>
      </section>

      <section className="p-6 text-body-sm leading-relaxed text-sale">
        <h3 className="font-display text-h6 text-sale">Excluir minha conta</h3>
        <p className="mt-1 text-ink-60">
          Esta ação remove permanentemente seus dados. Pedidos antigos são mantidos por
          obrigação fiscal.
        </p>
        <Button variant="danger" size="sm" className="mt-4">
          Solicitar exclusão
        </Button>
      </section>
    </div>
  );
}
