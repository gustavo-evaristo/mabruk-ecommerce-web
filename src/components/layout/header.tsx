'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Logo } from './logo';
import { TopBar } from './top-bar';
import { MobileMenu } from './mobile-menu';
import { Container } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { useCart } from '@/lib/providers/cart-provider';
import { cn } from '@/lib/utils/cn';
import type { Category, Collection } from '@/lib/api/types';

// ============================================================
// Mega menu types
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
  feature: MegaFeature | null;
}

interface NavItem {
  key: string;
  label: string;
  href: Route;
  mega?: MegaMenu;
}

// ============================================================
// Header
// ============================================================

interface HeaderProps {
  categories: Category[];
  collections: Collection[];
}

export function Header({ categories, collections }: HeaderProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, open: openCart } = useCart();

  const navItems = useMemo<NavItem[]>(() => {
    const featuredCollection = collections[0] ?? null;
    const collectionFeature: MegaFeature | null =
      featuredCollection && featuredCollection.coverImageUrl
        ? {
            eyebrow: 'Coleção · em destaque',
            title: featuredCollection.name,
            desc: featuredCollection.description ?? '',
            href: `/colecao/${featuredCollection.slug}` as Route,
            imageUrl: featuredCollection.coverImageUrl,
          }
        : null;

    const items: NavItem[] = [];

    if (categories.length > 0) {
      const categoriasMega: MegaMenu = {
        cols: [
          {
            title: 'Joias',
            links: categories.map((c) => ({
              label: c.name,
              href: `/${c.slug}` as Route,
            })),
          },
        ],
        feature: collectionFeature,
      };
      items.push({
        key: 'categorias',
        label: 'Categorias',
        href: '/categorias' as Route,
        mega: categoriasMega,
      });
    }

    // Top 4 categorias como links diretos
    categories.slice(0, 4).forEach((c) =>
      items.push({
        key: c.slug,
        label: c.name,
        href: `/${c.slug}` as Route,
      }),
    );

    if (collections.length > 0) {
      const colecoesMega: MegaMenu = {
        cols: [
          {
            title: 'Coleções',
            links: collections.map((c) => ({
              label: c.name,
              href: `/colecao/${c.slug}` as Route,
            })),
          },
        ],
        feature: collectionFeature,
      };
      items.push({
        key: 'colecoes',
        label: 'Coleções',
        href: '/colecoes' as Route,
        mega: colecoesMega,
      });
    }

    items.push({
      key: 'revendedoras',
      label: 'Seja uma revendedora',
      href: '/revendedoras' as Route,
    });

    return items;
  }, [categories, collections]);

  const active = navItems.find((i) => i.key === openKey);

  return (
    <header
      className="sticky top-0 z-50 bg-paper"
      onMouseLeave={() => setOpenKey(null)}
    >
      <TopBar />

      {/* Linha 1 — utilities + logo */}
      <div className="border-b border-line">
        <Container className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 lg:h-[100px] lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          {/* Mobile hamburger / Desktop utilities */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              className="cursor-pointer p-1 text-ink"
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
          <div className="hidden items-center gap-7 text-eyebrow font-medium uppercase tracking-eyebrow lg:flex">
            <Link
              href={'/cadastrar' as Route}
              className="inline-flex cursor-pointer items-center gap-2 text-champagne-dark hover:text-ink"
            >
              <Icon name="tag" size={14} stroke={1.2} />
              Ganhe 10% off
            </Link>
            <Link
              href={'/atendimento' as Route}
              className="inline-flex cursor-pointer items-center gap-2 text-ink-60 hover:text-ink"
            >
              <Icon name="bell" size={14} stroke={1.2} />
              Atendimento
            </Link>
          </div>

          {/* Logo centralizado */}
          <div className="flex justify-center">
            <Logo size={32} className="lg:hidden" />
            <Logo size={48} className="hidden lg:inline-flex" />
          </div>

          {/* Direita */}
          <div className="flex items-center justify-end gap-3 lg:gap-7">
            <Link
              href={'/entrar' as Route}
              aria-label="Entrar"
              className="inline-flex items-center gap-2.5 text-ink hover:text-ink-60"
            >
              <Icon name="user" size={22} stroke={1.2} />
              <span className="hidden text-eyebrow font-medium uppercase tracking-eyebrow lg:inline">
                Entrar
              </span>
            </Link>
            <Link
              href={'/conta/favoritos' as Route}
              aria-label="Favoritos"
              className="inline-flex items-center gap-2.5 text-ink hover:text-ink-60"
            >
              <span className="relative inline-flex">
                <Icon name="heart" size={22} stroke={1.2} />
              </span>
              <span className="hidden text-eyebrow font-medium uppercase tracking-eyebrow lg:inline">
                Favoritos
              </span>
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="inline-flex cursor-pointer items-center gap-2.5 text-ink hover:text-ink-60"
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
              <span className="hidden text-eyebrow font-medium uppercase tracking-eyebrow lg:inline">
                Sacola
              </span>
            </button>
          </div>
        </Container>
      </div>

      {/* Linha 2 — Nav (esconde no mobile, usa hamburger) */}
      {navItems.length > 1 && (
        <div className="hidden border-b border-line lg:block">
          <Container className="flex h-[54px] items-center justify-center gap-10">
            {navItems.map((item) => {
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
      )}

      {/* Mega-menu panel (apenas desktop) */}
      {active?.mega && (
        <div className="hidden lg:block">
          <MegaPanel mega={active.mega} />
        </div>
      )}

      {/* Mobile drawer */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        categories={categories}
        collections={collections}
      />
    </header>
  );
}

// ============================================================
// MegaPanel
// ============================================================

function MegaPanel({ mega }: { mega: MegaMenu }) {
  const featureColCount = mega.feature ? 1 : 0;
  return (
    <div className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-mega animate-fade-in">
      <div
        className="container-mabruk grid gap-12 py-10 pb-12"
        style={{
          gridTemplateColumns: `repeat(${mega.cols.length}, minmax(0, 1fr))${featureColCount ? ' 320px' : ''}`,
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

        {mega.feature && (
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
            {mega.feature.desc && (
              <div className="mt-1 text-body-sm text-ink-60">{mega.feature.desc}</div>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-eyebrow font-medium uppercase tracking-eyebrow">
              Explorar
              <Icon name="arrowRight" size={11} />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
