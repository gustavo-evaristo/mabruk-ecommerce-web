import { SiteHeader } from '@/components/layout/site-header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { LogoutButton } from '@/components/account/logout-button';
import { getAuthToken } from '@/lib/auth/session';
import { getCustomerMe } from '@/lib/api/endpoints/customers';
import { redirect } from 'next/navigation';

const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function memberSince(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  const token = await getAuthToken();
  if (!token) redirect('/entrar');

  let customer;
  try {
    customer = await getCustomerMe(token);
  } catch {
    redirect('/entrar');
  }

  const firstName = customer.name.split(/\s+/)[0] ?? customer.name;

  return (
    <>
      <SiteHeader />

      <section className="border-b border-line bg-cream">
        <Container className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:gap-8 lg:py-12">
          <div className="grid size-16 shrink-0 place-items-center rounded-full bg-ink font-display text-h5 text-paper lg:size-22 lg:text-h4">
            {initials(customer.name)}
          </div>
          <div className="flex-1">
            <div className="eyebrow">Olá,</div>
            <h1 className="mt-1.5 font-display text-h3 leading-none lg:text-h2">{firstName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-body-xs text-ink-60">
              <span>{customer.email}</span>
              <span className="hidden sm:inline">·</span>
              <span>Cliente desde {memberSince(customer.createdAt)}</span>
            </div>
          </div>
          <LogoutButton />
        </Container>
      </section>

      <Container className="grid gap-8 py-8 pb-16 lg:grid-cols-[260px_1fr] lg:gap-12 lg:py-12 lg:pb-24">
        <AccountSidebar />
        <div>{children}</div>
      </Container>

      <Footer />
    </>
  );
}
