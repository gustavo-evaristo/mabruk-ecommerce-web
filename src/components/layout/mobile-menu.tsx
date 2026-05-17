'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

interface NavSection {
  key: string;
  label: string;
  href?: Route;
  links?: { label: string; href: Route }[];
}

const SECTIONS: NavSection[] = [
  {
    key: 'novidades',
    label: 'Novidades',
    links: [
      { label: 'Lançamentos da semana', href: '/novidades' as Route },
      { label: 'Pré-venda', href: '/pre-venda' as Route },
      { label: 'Edições limitadas', href: '/edicoes-limitadas' as Route },
      { label: 'Voltaram ao estoque', href: '/voltaram-ao-estoque' as Route },
    ],
  },
  {
    key: 'categorias',
    label: 'Categorias',
    links: [
      { label: 'Anéis', href: '/aneis' as Route },
      { label: 'Brincos', href: '/brincos' as Route },
      { label: 'Colares', href: '/colares' as Route },
      { label: 'Conjuntos', href: '/conjuntos' as Route },
      { label: 'Pulseiras', href: '/pulseiras' as Route },
      { label: 'Braceletes', href: '/braceletes' as Route },
      { label: 'Tornozeleiras', href: '/tornozeleiras' as Route },
    ],
  },
  {
    key: 'colecoes',
    label: 'Coleções',
    links: [
      { label: 'Serene', href: '/colecao/serene' as Route },
      { label: 'Celeste', href: '/colecao/celeste' as Route },
      { label: 'Oásis', href: '/colecao/oasis' as Route },
    ],
  },
  { key: 'revendedoras', label: 'Seja uma revendedora', href: '/revendedoras' as Route },
  { key: 'rastrear', label: 'Rastrear pedido', href: '/rastrear' as Route },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Drawer */}
      <aside
        aria-hidden={!open}
        className={cn(
          'fixed top-0 left-0 z-[71] flex h-full w-full max-w-sm flex-col bg-paper shadow-modal transition-transform duration-300 ease-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header drawer */}
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <Link href="/" onClick={onClose} aria-label="Início">
            <Image
              src="/mabruk-logo.png"
              alt="Mabruk Semijoias"
              width={120}
              height={28}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="cursor-pointer text-ink hover:text-ink-60"
          >
            <Icon name="close" size={22} />
          </button>
        </header>

        {/* Sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {SECTIONS.map((s) => {
            const isOpen = expanded === s.key;
            if (s.links) {
              return (
                <div key={s.key} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : s.key)}
                    className="flex w-full cursor-pointer items-center justify-between px-3 py-4 text-eyebrow font-medium uppercase tracking-eyebrow-lg"
                  >
                    {s.label}
                    <Icon name={isOpen ? 'minus' : 'plus'} size={14} />
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-1 pb-3">
                      {s.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={onClose}
                          className="px-3 py-2.5 font-display text-body-xl text-ink hover:bg-cream"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={s.key}
                href={s.href!}
                onClick={onClose}
                className="block border-b border-line px-3 py-4 text-eyebrow font-medium uppercase tracking-eyebrow-lg text-ink hover:bg-cream"
              >
                {s.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer drawer (auth links) */}
        <footer className="flex flex-col gap-1 border-t border-line px-5 py-4">
          <Link
            href={'/entrar' as Route}
            onClick={onClose}
            className="inline-flex items-center gap-2.5 py-2 text-body text-ink"
          >
            <Icon name="user" size={18} />
            Entrar / criar conta
          </Link>
          <Link
            href={'/conta/favoritos' as Route}
            onClick={onClose}
            className="inline-flex items-center gap-2.5 py-2 text-body text-ink"
          >
            <Icon name="heart" size={18} />
            Favoritos
          </Link>
        </footer>
      </aside>
    </>
  );
}
