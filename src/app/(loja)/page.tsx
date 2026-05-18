import type { Route } from 'next';
import { listCategories } from '@/lib/api/endpoints/categories';
import { listCollections } from '@/lib/api/endpoints/collections';
import { listProducts, listFeaturedProducts } from '@/lib/api/endpoints/products';
import {
  Hero,
  CategoryStrip,
  EditorialBanner,
  CollectionBlock,
  FullBleedEditorial,
  RevendedoraSection,
  ValueProps,
  Newsletter,
} from '@/components/home';
import { Container } from '@/components/ui/container';
import { SectionHead } from '@/components/ui/section-head';
import { ProductGrid } from '@/components/product/product-grid';

export default async function HomePage() {
  const [categories, collections, newest, featured] = await Promise.all([
    listCategories().catch(() => []),
    listCollections().catch(() => []),
    listProducts({ sort: 'newest', pageSize: 4 }).catch(() => ({
      items: [],
      total: 0,
      page: 1,
      pageSize: 4,
      totalPages: 1,
    })),
    listFeaturedProducts().catch(() => []),
  ]);

  const featuredCollection = collections[0] ?? null;
  const primaryCategory = categories[0] ?? null;
  const featuredProduct = featured[0] ?? newest.items[0] ?? null;
  const novidadesHref: Route = primaryCategory
    ? (`/${primaryCategory.slug}` as Route)
    : ('/' as Route);

  return (
    <>
      <Hero
        primaryCategory={primaryCategory}
        featuredCollection={featuredCollection}
        featuredProduct={featuredProduct}
      />

      {categories.length > 0 && <CategoryStrip categories={categories} />}

      <EditorialBanner categories={categories} featuredCollection={featuredCollection} />

      {newest.items.length > 0 && (
        <section className="bg-paper py-14 lg:py-24">
          <Container>
            <SectionHead
              eyebrow="Recém-chegadas"
              title="Novidades da semana"
              link={{ label: 'Ver todas as novidades', href: novidadesHref }}
            />
            <ProductGrid products={newest.items} />
          </Container>
        </section>
      )}

      {featuredCollection && <CollectionBlock collection={featuredCollection} />}

      <FullBleedEditorial />

      {featured.length > 0 && (
        <section className="bg-paper py-14 lg:py-24">
          <Container>
            <SectionHead
              eyebrow="As mais amadas"
              title="Bestsellers"
              link={{ label: 'Ver ranking completo', href: novidadesHref }}
            />
            <ProductGrid products={featured.slice(0, 4)} />
          </Container>
        </section>
      )}

      <RevendedoraSection />

      <ValueProps />
      <Newsletter />
    </>
  );
}
