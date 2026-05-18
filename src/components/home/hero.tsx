import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import {
  FreeShippingThreshold,
  InstallmentBadge,
} from '@/components/ui/installment-text';
import type { Category, Collection, Product } from '@/lib/api/types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1600&q=80';
const HERO_INSET =
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80';

interface Props {
  primaryCategory: Category | null;
  featuredCollection: Collection | null;
  featuredProduct: Product | null;
}

export function Hero({ primaryCategory, featuredCollection, featuredProduct }: Props) {
  const primaryHref: Route = primaryCategory
    ? (`/${primaryCategory.slug}` as Route)
    : ('/' as Route);
  const secondaryHref: Route | null = featuredCollection
    ? (`/colecao/${featuredCollection.slug}` as Route)
    : null;

  const insetImage = featuredProduct?.image?.url ?? HERO_INSET;
  const mainImage = featuredCollection?.coverImageUrl ?? HERO_IMAGE;

  return (
    <section className="relative bg-cream">
      <Container className="grid items-center gap-10 py-10 lg:min-h-[680px] lg:gap-16 lg:py-0 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col gap-5 lg:gap-7 lg:py-16">
          <div className="eyebrow-hero">Mabruk Semijoias</div>
          <h1 className="text-[44px] leading-[1] tracking-tight sm:text-[60px] lg:text-display-lg lg:leading-tight">
            O brilho que
            <br />
            <span className="em-italic">permanece</span>
          </h1>
          <p className="max-w-[460px] text-body-md leading-relaxed text-ink-60 lg:text-body-xl">
            Semijoias com banho de ouro 18k, prata 925 e aço inoxidável, desenhadas para
            acompanhar as histórias que importam.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            {primaryCategory && (
              <Link href={primaryHref}>
                <Button variant="primary" size="lg">
                  Comprar agora
                </Button>
              </Link>
            )}
            {secondaryHref && featuredCollection && (
              <Link href={secondaryHref}>
                <Button
                  variant="ghost"
                  size="lg"
                  iconRight={<Icon name="arrowRight" size={14} />}
                >
                  Conhecer coleção {featuredCollection.name}
                </Button>
              </Link>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-6 border-t border-ink/10 pt-6 lg:mt-8 lg:gap-8 lg:pt-8">
            <div className="flex flex-col gap-1">
              <div className="eyebrow !text-ink-60">Banho de</div>
              <div className="font-display text-body-xl lg:text-lead">Ouro 18k</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="eyebrow !text-ink-60">Garantia</div>
              <div className="font-display text-body-xl lg:text-lead">12 meses</div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="eyebrow !text-ink-60">Frete grátis acima</div>
              <div className="font-display text-body-xl lg:text-lead">
                <FreeShippingThreshold />
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] sm:h-[500px] lg:h-[620px]">
          <div className="absolute top-0 left-0 h-full w-[72%] overflow-hidden">
            <Image
              src={mainImage}
              alt={featuredCollection ? `Coleção ${featuredCollection.name}` : 'Mabruk Semijoias'}
              fill
              priority
              sizes="(min-width: 1280px) 600px, 50vw"
              className="object-cover"
            />
            {featuredProduct && (
              <Link
                href={`/produto/${featuredProduct.slug}` as Route}
                className="absolute bottom-3 left-3 bg-paper/95 px-3 py-2 backdrop-blur-sm lg:bottom-6 lg:left-6 lg:px-5 lg:py-3"
              >
                <div className="eyebrow !text-ink-60">Em destaque</div>
                <div className="mt-1 font-display text-body-xl lg:text-h6">
                  {featuredProduct.name}
                </div>
                <div className="font-mono nums text-body-xs text-ink-80 lg:text-body-sm">
                  {formatMoney(featuredProduct.priceFromCents)} · <InstallmentBadge />
                </div>
              </Link>
            )}
          </div>
          <div className="absolute right-0 bottom-0 h-[46%] w-[40%] overflow-hidden shadow-[-12px_-12px_0_var(--color-cream)] lg:shadow-[-20px_-20px_0_var(--color-cream)]">
            <Image
              src={insetImage}
              alt={featuredProduct?.name ?? 'Detalhe de joia'}
              fill
              sizes="(min-width: 1280px) 280px, 30vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
