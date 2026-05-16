'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { cn } from '@/lib/utils/cn';

const TABS: { href: Route; label: string }[] = [
  { href: '/entrar' as Route, label: 'Entrar' },
  { href: '/cadastrar' as Route, label: 'Criar conta' },
];

export function AuthTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-7 flex">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              'flex-1 border-b-2 py-3.5 text-center text-eyebrow font-medium uppercase tracking-eyebrow-xl',
              active ? 'border-ink text-ink' : 'border-line text-ink-60',
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
