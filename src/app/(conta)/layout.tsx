import Link from 'next/link';
import type { Route } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Icon, type IconName } from '@/components/ui/icon';
import { AccountSidebar } from '@/components/account/account-sidebar';

const USER = {
  firstName: 'Gustavo',
  email: 'gustavo@email.com.br',
  initials: 'GE',
  memberSince: 'janeiro de 2025',
};

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      {/* Saudação */}
      <section className="border-b border-line bg-cream">
        <Container className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:gap-8 lg:py-12">
          <div className="grid size-16 shrink-0 place-items-center rounded-full bg-ink font-display text-h5 text-paper lg:size-22 lg:text-h4">
            {USER.initials}
          </div>
          <div className="flex-1">
            <div className="eyebrow">Olá,</div>
            <h1 className="mt-1.5 font-display text-h3 leading-none lg:text-h2">{USER.firstName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-body-xs text-ink-60">
              <span>{USER.email}</span>
              <span className="hidden sm:inline">·</span>
              <span>Cliente desde {USER.memberSince}</span>
            </div>
          </div>
          <Link
            href="/"
            className="self-start border border-line px-4 py-2.5 text-eyebrow font-medium uppercase tracking-eyebrow sm:self-auto"
          >
            Sair da conta
          </Link>
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
