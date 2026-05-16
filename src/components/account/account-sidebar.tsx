'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

const NAV: { href: Route; icon: IconName; label: string; count?: number }[] = [
  { href: '/conta' as Route, icon: 'home', label: 'Visão geral' },
  { href: '/conta/pedidos' as Route, icon: 'pkg', label: 'Meus pedidos', count: 4 },
  { href: '/conta/favoritos' as Route, icon: 'heart', label: 'Favoritos', count: 6 },
  { href: '/conta/dados' as Route, icon: 'user', label: 'Dados pessoais' },
  { href: '/conta/enderecos' as Route, icon: 'map', label: 'Endereços', count: 2 },
];

export function AccountSidebar() {
  const pathname = usePathname();
  return (
    <aside className="lg:sticky lg:top-44 lg:self-start">
      <div className="eyebrow mb-4">Minha conta</div>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active =
            item.href === '/conta'
              ? pathname === '/conta'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-3 transition-colors',
                active ? 'bg-ink text-paper' : 'text-ink-80 hover:bg-cream',
              )}
            >
              <Icon name={item.icon} size={16} />
              <span className="flex-1 text-body">{item.label}</span>
              {item.count !== undefined && (
                <span className="font-mono nums text-body-xs opacity-70">{item.count}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 bg-cream p-5 text-body-sm leading-relaxed text-ink-60">
        <strong className="mb-1.5 block font-display text-body-xl text-ink">
          Precisa de ajuda?
        </strong>
        Nosso time atende de seg a sex, das 9h às 18h.
        <Link
          href={'/atendimento' as Route}
          className="mt-2.5 inline-block text-eyebrow font-medium uppercase tracking-eyebrow text-ink underline"
        >
          Falar com atendimento →
        </Link>
      </div>
    </aside>
  );
}
