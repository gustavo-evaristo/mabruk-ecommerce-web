'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Logo } from './logo';
import { TopBar } from './top-bar';
import { Container } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { useCart } from '@/lib/providers/cart-provider';
import { cn } from '@/lib/utils/cn';

// ============================================================
// Mega menus
// ============================================================

interface MegaCol {
  title: string;
  links: { label: string; href: Route }[];
}

interface MegaFeature {
  eyebrow: string;
  title: string;
  desc: string;
  href: Route;
  imageUrl: string;
}

interface MegaMenu {
  cols: MegaCol[];
  feature: MegaFeature;
}

const NOVIDADES_MEGA: MegaMenu = {
  cols: [
    {
      title: 'Recém-chegadas',
      links: [
        { label: 'Lançamentos da semana', href: '/novidades' as Route },
        { label: 'Pré-venda', href: '/pre-venda' as Route },
        { label: 'Edições limitadas', href: '/edicoes-limitadas' as Route },
        { label: 'Voltaram ao estoque', href: '/voltaram-ao-estoque' as Route },
      ],
    },
    {
      title: 'Por ocasião',
      links: [
        { label: 'Presente para ela', href: '/ocasiao/presente' as Route },
        { label: 'Trabalho', href: '/ocasiao/trabalho' as Route },
        { label: 'Festa', href: '/ocasiao/festa' as Route },
        { label: 'Dia a dia', href: '/ocasiao/dia-a-dia' as Route },
      ],
    },
  ],
  feature: {
    eyebrow: 'Modelo · em destaque',
    title: 'Coleção Celeste',
    desc: 'Inspirada no céu noturno',
    href: '/colecao/celeste' as Route,
    imageUrl:
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=600&q=80',
  },
};

const CATEGORIAS_MEGA: MegaMenu = {
  cols: [
    {
      title: 'Joias',
      links: [
        { label: 'Anéis', href: '/aneis' as Route },
        { label: 'Brincos', href: '/brincos' as Route },
        { label: 'Colares', href: '/colares' as Route },
        { label: 'Pulseiras', href: '/pulseiras' as Route },
        { label: 'Tornozeleiras', href: '/tornozeleiras' as Route },
      ],
    },
    {
      title: 'Conjuntos & sets',
      links: [
        { label: 'Conjuntos completos', href: '/conjuntos' as Route },
        { label: 'Trios de anéis', href: '/trios-de-aneis' as Route },
        { label: 'Mix de brincos', href: '/mix-de-brincos' as Route },
        { label: 'Layered necklaces', href: '/layered-necklaces' as Route },
      ],
    },
    {
      title: 'Por material',
      links: [
        { label: 'Banho de ouro 18k', href: '/material/ouro-18k' as Route },
        { label: 'Prata 925', href: '/material/prata-925' as Route },
        { label: 'Aço inoxidável', href: '/material/aco-inox' as Route },
      ],
    },
  ],
  feature: {
    eyebrow: 'Modelo · em destaque',
    title: 'Coleção Serene',
    desc: 'Linhas etéreas e minimalistas',
    href: '/colecao/serene' as Route,
    imageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=600&q=80',
  },
};

const COLECOES_MEGA: MegaMenu = {
  cols: [
    {
      title: 'Coleções atuais',
      links: [
        { label: 'Serene', href: '/colecao/serene' as Route },
        { label: 'Celeste', href: '/colecao/celeste' as Route },
        { label: 'Oásis', href: '/colecao/oasis' as Route },
        { label: 'Atemporais', href: '/colecao/atemporais' as Route },
      ],
    },
    {
      title: 'Editoriais',
      links: [
        { label: 'Outono · Inverno 26', href: '/editorial/outono-inverno-26' as Route },
        { label: 'Verão 25', href: '/editorial/verao-25' as Route },
        { label: 'Noivas', href: '/editorial/noivas' as Route },
        { label: 'Cápsula Oscar Freire', href: '/editorial/capsula-oscar-freire' as Route },
      ],
    },
  ],
  feature: {
    eyebrow: 'Modelo · em destaque',
    title: 'Coleção Oásis',
    desc: 'Toque dourado atemporal',
    href: '/colecao/oasis' as Route,
    imageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=600&q=80',
  },
};

// ============================================================
// Nav items
// ============================================================

interface NavItem {
  key: string;
  label: string;
  href: Route;
  mega?: MegaMenu;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'novidades', label: 'Novidades', href: '/novidades' as Route, mega: NOVIDADES_MEGA },
  { key: 'categorias', label: 'Categorias', href: '/categorias' as Route, mega: CATEGORIAS_MEGA },
  { key: 'aneis', label: 'Anéis', href: '/aneis' as Route },
  { key: 'brincos', label: 'Brincos', href: '/brincos' as Route },
  { key: 'colares', label: 'Colares', href: '/colares' as Route },
  { key: 'pulseiras', label: 'Pulseiras', href: '/pulseiras' as Route },
  { key: 'colecoes', label: 'Coleções', href: '/colecoes' as Route, mega: COLECOES_MEGA },
  { key: 'revendedoras', label: 'Seja uma revendedora', href: '/revendedoras' as Route },
];

// ============================================================
// Header
// ============================================================

export function Header() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { totalItems, open: openCart } = useCart();

  const active = NAV_ITEMS.find((i) => i.key === openKey);

  return (
    <header
      className="sticky top-0 z-50 bg-paper"
      onMouseLeave={() => setOpenKey(null)}
    >
      <TopBar />

      {/* Linha 1 — utilities + logo */}
      <div className="border-b border-line">
        <Container className="grid h-[100px] grid-cols-[1fr_auto_1fr] items-center gap-8">
          {/* Esquerda */}
          <div className="flex items-center gap-7 text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
            <button
              type="button"
              className="inline-flex items-center gap-2 hover:text-ink"
            >
              <Icon name="truck" size={14} stroke={1.2} />
              Rastrear pedido
            </button>
          </div>

          {/* Logo centralizado */}
          <Logo size={48} />

          {/* Direita */}
          <div className="flex items-center justify-end gap-7">
            <Link
              href={'/entrar' as Route}
              className="inline-flex items-center gap-2.5 text-ink hover:text-ink-60"
            >
              <Icon name="user" size={22} stroke={1.2} />
              <span className="text-eyebrow font-medium uppercase tracking-eyebrow">
                Entrar
              </span>
            </Link>
            <Link
              href={'/conta/favoritos' as Route}
              className="inline-flex items-center gap-2.5 text-ink hover:text-ink-60"
            >
              <span className="relative inline-flex">
                <Icon name="heart" size={22} stroke={1.2} />
                <span className="font-mono nums absolute -top-1.5 -right-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-1.5 text-[10px] font-semibold text-paper ring-2 ring-paper">
                  2
                </span>
              </span>
              <span className="text-eyebrow font-medium uppercase tracking-eyebrow">
                Favoritos
              </span>
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex items-center gap-2.5 text-ink hover:text-ink-60"
              aria-label={`Sacola${totalItems > 0 ? ` com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`}
            >
              <span className="relative inline-flex">
                <Icon name="bag" size={22} stroke={1.2} />
                {totalItems > 0 && (
                  <span className="font-mono nums absolute -top-1.5 -right-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-ink px-1.5 text-[10px] font-semibold text-paper ring-2 ring-paper">
                    {totalItems}
                  </span>
                )}
              </span>
              <span className="text-eyebrow font-medium uppercase tracking-eyebrow">
                Sacola
              </span>
            </button>
          </div>
        </Container>
      </div>

      {/* Linha 2 — Nav */}
      <div className="border-b border-line">
        <Container className="flex h-[54px] items-center justify-center gap-10">
          {NAV_ITEMS.map((item) => {
            const isOpen = openKey === item.key;
            return (
              <div
                key={item.key}
                onMouseEnter={() => setOpenKey(item.mega ? item.key : null)}
                className="flex h-full items-center"
              >
                {item.mega ? (
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    className={cn(
                      '-mb-px inline-flex h-full cursor-default items-center gap-1.5 border-b-2 bg-transparent text-eyebrow font-medium uppercase tracking-eyebrow-lg transition-colors',
                      isOpen ? 'border-ink text-ink' : 'border-transparent text-ink hover:text-ink-60',
                    )}
                  >
                    {item.label}
                    <Icon name="chevronDown" size={10} stroke={1.5} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      '-mb-px inline-flex h-full items-center gap-1.5 border-b-2 text-eyebrow font-medium uppercase tracking-eyebrow-lg transition-colors',
                      isOpen ? 'border-ink text-ink' : 'border-transparent text-ink hover:text-ink-60',
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </Container>
      </div>

      {/* Mega-menu panel */}
      {active?.mega && <MegaPanel mega={active.mega} />}
    </header>
  );
}

// ============================================================
// MegaPanel
// ============================================================

function MegaPanel({ mega }: { mega: MegaMenu }) {
  return (
    <div className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-mega animate-fade-in">
      <div
        className="container-mabruk grid gap-12 py-10 pb-12"
        style={{
          gridTemplateColumns: `repeat(${mega.cols.length}, minmax(0, 1fr)) 320px`,
        }}
      >
        {mega.cols.map((col) => (
          <div key={col.title}>
            <div className="eyebrow mb-4 !text-ink-60">{col.title}</div>
            <div className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-display text-lead text-ink transition-colors hover:text-ink-60"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <Link href={mega.feature.href} className="group block">
          <div className="relative aspect-[4/5] max-h-72 overflow-hidden bg-cream">
            <Image
              src={mega.feature.imageUrl}
              alt={mega.feature.title}
              fill
              sizes="320px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-3 left-0 right-0 text-center font-mono text-[9px] uppercase tracking-eyebrow-lg text-ink-40">
              {mega.feature.eyebrow}
            </div>
          </div>
          <div className="mt-3 font-display text-h6">{mega.feature.title}</div>
          <div className="mt-1 text-body-sm text-ink-60">{mega.feature.desc}</div>
          <span className="mt-3 inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-eyebrow font-medium uppercase tracking-eyebrow">
            Explorar
            <Icon name="arrowRight" size={11} />
          </span>
        </Link>
      </div>
    </div>
  );
}
