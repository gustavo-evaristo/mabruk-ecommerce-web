import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card } from '@/components/admin/ui';
import { Icon } from '@/components/ui/icon';
import { getAdminToken } from '@/lib/auth/admin-session';
import { getAdminCustomer } from '@/lib/api/endpoints/admin';
import { ApiError } from '@/lib/api/client';

interface Props {
  params: Promise<{ id: string }>;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  let customer;
  try {
    customer = await getAdminCustomer(token, id);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) notFound();
    throw err;
  }

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/clientes' as Route} className="hover:text-ink">
              Clientes
            </Link>
            <Icon name="chevronRight" size={10} />
            <span>Detalhe</span>
          </span>
        }
        title={customer.name}
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[320px_1fr] lg:p-10">
        <aside className="flex flex-col gap-4">
          <div className="border border-line bg-paper p-6 text-center">
            <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full bg-ink font-display text-h5 font-medium text-paper">
              {initials(customer.name)}
            </div>
            <div className="font-display text-h6">{customer.name}</div>
            <div className="mt-1 text-body-sm text-ink-60">Cliente desde {formatDate(customer.createdAt)}</div>
          </div>

          <Card title="Contato">
            <div className="flex flex-col gap-2.5 text-body-sm">
              <div>
                <div className="text-ink-60">E-mail</div>
                <div className="font-mono text-eyebrow">{customer.email}</div>
              </div>
              <div>
                <div className="text-ink-60">Telefone</div>
                <div className="font-mono">
                  {customer.phone ?? <span className="text-ink-40">—</span>}
                </div>
              </div>
              <div>
                <div className="text-ink-60">CPF/CNPJ</div>
                <div className="font-mono">
                  {customer.cpfCnpj ?? <span className="text-ink-40">—</span>}
                </div>
              </div>
            </div>
          </Card>
        </aside>

        <div className="flex flex-col gap-4">
          <Card title="Histórico de pedidos">
            <div className="py-6 text-center text-body-sm text-ink-60">
              Pedidos deste cliente aparecem em{' '}
              <Link href={'/admin/pedidos' as Route} className="text-ink underline">
                Pedidos
              </Link>{' '}
              filtrando pelo e-mail.
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
