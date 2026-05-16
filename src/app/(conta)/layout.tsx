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
  tier: 'Insider',
};

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      {/* Saudação */}
      <section className="border-b border-line bg-cream">
        <Container className="flex items-center gap-8 py-12">
          <div className="grid size-22 place-items-center rounded-full bg-ink font-display text-h4 text-paper">
            {USER.initials}
          </div>
          <div className="flex-1">
            <div className="eyebrow">Olá,</div>
            <h1 className="mt-1.5 font-display text-h2 leading-none">{USER.firstName}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-body-xs text-ink-60">
              <span>{USER.email}</span>
              <span>·</span>
              <span>Cliente desde {USER.memberSince}</span>
              <span className="bg-champagne px-2.5 py-1 text-eyebrow-sm font-semibold uppercase tracking-eyebrow text-ink">
                {USER.tier}
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="border border-line px-4 py-2.5 text-eyebrow font-medium uppercase tracking-eyebrow"
          >
            Sair da conta
          </Link>
        </Container>
      </section>

      <Container className="grid gap-12 py-12 pb-24 lg:grid-cols-[260px_1fr]">
        <AccountSidebar />
        <div>{children}</div>
      </Container>

      <Footer />
    </>
  );
}
