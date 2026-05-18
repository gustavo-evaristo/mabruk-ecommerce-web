import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Route } from 'next';
import { getCollectionBySlug, listCollections } from '@/lib/api/endpoints/collections';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProductGrid } from '@/components/product/product-grid';
import { SectionHead } from '@/components/ui/section-head';
import { ValueProps } from '@/components/home/value-props';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const data = await getCollectionBySlug(slug);
  return { title: data ? `Coleção ${data.collection.name}` : 'Coleção' };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const [data, allCollections] = await Promise.all([
    getCollectionBySlug(slug),
    listCollections(),
  ]);
  if (!data) notFound();

  const others = allCollections.filter((c) => c.slug !== slug);
  const inkClass = 'text-ink';
  const subClass = 'text-ink-60';
  const accentBg = 'bg-cream';
  const isDark = false;

  return (
    <>
      {/* HERO */}
      <section className={`${accentBg} ${inkClass}`}>
        <div className="grid grid-cols-1 md:min-h-[620px] md:grid-cols-[1.05fr_1fr]">
          <div className="relative min-h-[300px] overflow-hidden md:min-h-[620px]">
            <Image
              src={data.collection.coverImageUrl ?? 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1400&q=80'}
              alt={`Coleção ${data.collection.name}`}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            {isDark && (
              <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
            )}
            <div className="absolute top-4 left-4 bg-paper/95 px-3.5 py-1.5 text-eyebrow-sm font-medium uppercase tracking-eyebrow text-ink md:top-8 md:left-8">
              Coleção {data.collection.name}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-5 px-6 py-14 md:gap-7 md:px-20 md:py-24">
            <div>
              <div className={`text-eyebrow font-medium uppercase tracking-eyebrow-xl ${subClass}`}>
                Coleção
              </div>
              <h1
                className={`mt-3 font-display text-[44px] leading-[1.05] tracking-tight sm:text-[60px] md:text-display-lg md:leading-tight ${inkClass}`}
              >
                {data.collection.name}
              </h1>
            </div>
            {data.collection.description && (
              <p className={`max-w-[480px] text-body-md leading-relaxed md:text-body-lg ${subClass}`}>
                {data.collection.description}
              </p>
            )}
            <div className="mt-3 flex gap-3">
              <Link href={`#grid` as Route} scroll>
                <Button variant={isDark ? 'light' : 'primary'} iconRight={<Icon name="arrowRight" size={14} />}>
                  Ver peças
                </Button>
              </Link>
            </div>
            <div
              className={`mt-4 flex gap-8 border-t pt-6 md:mt-6 md:gap-14 md:pt-7 ${isDark ? 'border-paper/15' : 'border-ink/10'}`}
            >
              <div>
                <div className={`font-display text-h4 md:text-h3 ${inkClass}`}>{data.products.total}</div>
                <div className={`eyebrow mt-1.5 ${subClass}`}>Peças exclusivas</div>
              </div>
              <div>
                <div className={`font-display text-h4 md:text-h3 ${inkClass}`}>18k</div>
                <div className={`eyebrow mt-1.5 ${subClass}`}>Banho de ouro</div>
              </div>
              <div>
                <div className={`font-display text-h4 md:text-h3 ${inkClass}`}>Maio 26</div>
                <div className={`eyebrow mt-1.5 ${subClass}`}>Lançamento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Switcher */}
      <section className="border-b border-line bg-paper">
        <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-5 text-eyebrow font-medium uppercase tracking-eyebrow lg:py-6">
          <span className="text-ink-60">Outras coleções:</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {others.map((c) => (
              <Link
                key={c.id}
                href={`/colecao/${c.slug}` as Route}
                className="inline-flex items-center gap-1.5 text-ink"
              >
                {c.name}
                <Icon name="arrowRight" size={11} />
              </Link>
            ))}
          </div>
          <span className="font-mono nums tracking-normal text-ink-60 normal-case sm:ml-auto">
            {data.products.total} peças
          </span>
        </Container>
      </section>

      {/* Grid */}
      <section id="grid" className="bg-paper py-14 lg:py-24">
        <Container>
          <SectionHead
            eyebrow="As peças"
            title={`Coleção ${data.collection.name}`}
            align="left"
          />
          <ProductGrid products={data.products.items} />
        </Container>
      </section>

      {/* Outras coleções */}
      {others.length > 0 && (
        <section className="bg-cream py-14 lg:py-20">
          <Container>
            <SectionHead eyebrow="Continue explorando" title="Outras coleções" />
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((c) => (
                <Link
                  key={c.id}
                  href={`/colecao/${c.slug}` as Route}
                  className="liftable flex flex-col gap-4"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {c.coverImageUrl && (
                      <Image
                        src={c.coverImageUrl}
                        alt={c.name}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="eyebrow">Coleção</div>
                    <div className="mt-1.5 font-display text-h3">{c.name}</div>
                    <p className="mt-1 font-display text-body-xl italic text-ink-60">
                      {c.description ?? ''}
                    </p>
                    <span className="mt-3.5 inline-flex items-center gap-1.5 border-b border-ink pb-0.5 text-eyebrow font-medium uppercase tracking-eyebrow">
                      Ver coleção <Icon name="arrowRight" size={11} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <ValueProps />
    </>
  );
}
