'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';
import { Logo } from '@/components/layout/logo';
import { Icon, type IconName } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';
import { adminLogoutAction } from '@/lib/auth/admin-actions';
import type { AdminMe } from '@/lib/api/endpoints/admin-auth';

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

interface NavItem {
  id: string;
  icon: IconName;
  label: string;
  href: Route;
  match?: (path: string) => boolean;
  count?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: 'chart', label: 'Visão geral', href: '/admin' as Route, match: (p) => p === '/admin' },
  { id: 'orders', icon: 'pkg', label: 'Pedidos', href: '/admin/pedidos' as Route, count: 12 },
  { id: 'products', icon: 'box', label: 'Produtos', href: '/admin/produtos' as Route },
  { id: 'customers', icon: 'users', label: 'Clientes', href: '/admin/clientes' as Route },
  { id: 'promotions', icon: 'tag', label: 'Promoções', href: '/admin/promocoes' as Route },
];

const CONTENT_ITEMS: NavItem[] = [
  { id: 'collections', icon: 'grid', label: 'Coleções', href: '/admin/colecoes' as Route },
  { id: 'banners', icon: 'eye', label: 'Banners & landing', href: '/admin/banners' as Route },
  { id: 'reviews', icon: 'star', label: 'Avaliações', href: '/admin/avaliacoes' as Route, count: 4 },
];

const SYSTEM_ITEMS: NavItem[] = [
  { id: 'settings', icon: 'settings', label: 'Configurações', href: '/admin/configuracoes' as Route },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 border-l-2 px-3 py-2.5 text-body-sm transition-colors',
        active
          ? 'border-champagne bg-paper/8 text-paper'
          : 'border-transparent text-paper/70 hover:bg-paper/5 hover:text-paper',
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon name={item.icon} size={16} />
      <span className="flex-1">{item.label}</span>
      {item.count && (
        <span className="font-mono rounded-full bg-paper/10 px-2 py-0.5 text-[10px]">
          {item.count}
        </span>
      )}
    </Link>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-5 pb-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-paper/40 first:pt-2">
      {children}
    </div>
  );
}

interface AdminSidebarProps {
  admin: AdminMe;
}

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname() ?? '/admin';

  const isActive = (item: NavItem) => {
    if (item.match) return item.match(pathname);
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-ink text-paper">
      <div className="border-b border-paper/10 px-6 pt-7 pb-8">
        <div className="invert">
          <Logo size={24} />
        </div>
        <div className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.28em] text-paper/50">
          Painel administrativo
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-5">
        <GroupLabel>Gestão</GroupLabel>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.id} item={item} active={isActive(item)} />
        ))}
        <GroupLabel>Conteúdo</GroupLabel>
        {CONTENT_ITEMS.map((item) => (
          <NavLink key={item.id} item={item} active={isActive(item)} />
        ))}
        <GroupLabel>Sistema</GroupLabel>
        {SYSTEM_ITEMS.map((item) => (
          <NavLink key={item.id} item={item} active={isActive(item)} />
        ))}
      </nav>

      <div className="border-t border-paper/10 p-4">
        <div className="flex items-center gap-3 p-2">
          <div className="grid size-8 place-items-center rounded-full bg-champagne text-body-sm font-semibold text-ink">
            {initials(admin.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-body-sm font-medium">{admin.name}</div>
            <div className="text-[10px] text-paper/50">{admin.role}</div>
          </div>
          <form action={adminLogoutAction}>
            <button
              type="submit"
              title="Sair"
              className="cursor-pointer text-paper/50 hover:text-paper"
            >
              <Icon name="close" size={14} />
            </button>
          </form>
        </div>
        <Link
          href={'/' as Route}
          className="mt-2 block w-full border border-paper/10 px-3 py-2 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-paper/60 hover:border-paper/30 hover:text-paper"
        >
          Ver loja ↗
        </Link>
      </div>
    </aside>
  );
}
