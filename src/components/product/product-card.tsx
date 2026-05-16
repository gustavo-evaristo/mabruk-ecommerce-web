import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { Product } from '@/lib/api/types';
import { formatMoney, installmentValue } from '@/lib/utils/format';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { cn } from '@/lib/utils/cn';

interface ProductCardProps {
  product: Product;
  /** Mostra badges (novidade, etc) — apenas em listas, não em mini-cards. */
  badges?: ('new' | 'sale')[];
  /** Compact = sem subtítulo de coleção, sem parcelas. */
  compact?: boolean;
}

const INSTALLMENTS = 2;

export function ProductCard({ product, badges, compact }: ProductCardProps) {
  const priceCents = product.priceFromCents;
  const hasRange = product.priceFromCents !== product.priceToCents;
  const href = `/produto/${product.slug}` as Route;

  return (
    <article className="product-card group liftable relative">
      <Link href={href} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.alt ?? product.name}
              fill
              sizes="(min-width: 1280px) 320px, (min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-ink-40">
              <Icon name="box" size={28} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {badges?.includes('new') && <Tag variant="new">Novidade</Tag>}
            {!product.inStock && <Tag variant="line">Esgotado</Tag>}
          </div>

          {/* Wishlist (decorativo no card; o link do produto pega o clique) */}
          <span
            aria-hidden
            className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity duration-250 group-hover:opacity-100"
          >
            <Icon name="heart" size={14} />
          </span>

          {/* Quick add — slides up on hover */}
          <div className="absolute right-3 bottom-3 left-3 translate-y-2 opacity-0 transition-all duration-250 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block bg-ink py-3 text-center text-eyebrow font-medium uppercase tracking-eyebrow text-paper">
              Compra rápida
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-1">
        {!compact && (
          <div className="eyebrow !text-ink-40">{product.category.name}</div>
        )}
        <Link href={href} className="font-display text-lead leading-snug hover:underline">
          {product.name}
        </Link>
        <div className={cn('mt-1 font-mono nums text-body-md', !product.inStock && 'text-ink-40')}>
          {hasRange ? (
            <>
              {formatMoney(product.priceFromCents)} <span className="text-ink-40">–</span>{' '}
              {formatMoney(product.priceToCents)}
            </>
          ) : (
            formatMoney(priceCents)
          )}
        </div>
        {!compact && product.inStock && (
          <div className="text-body-xs text-ink-60">
            ou <span className="font-mono nums">{INSTALLMENTS}x</span> de{' '}
            <span className="font-mono nums">
              {formatMoney(installmentValue(priceCents, INSTALLMENTS))}
            </span>{' '}
            sem juros
          </div>
        )}
      </div>
    </article>
  );
}
