import { listCategories } from '@/lib/api/endpoints/categories';
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
  const [categories, newest, featured] = await Promise.all([
    listCategories(),
    listProducts({ sort: 'newest', pageSize: 4 }),
    listFeaturedProducts(),
  ]);

  return (
    <>
      <Hero />
      <CategoryStrip categories={categories} />
      <EditorialBanner />

      <section className="bg-paper py-24">
        <Container>
          <SectionHead
            eyebrow="Recém-chegadas"
            title="Novidades da semana"
            link={{ label: 'Ver todas as novidades', href: '/novidades' as never }}
          />
          <ProductGrid products={newest.items} />
        </Container>
      </section>

      <CollectionBlock />
      <FullBleedEditorial />

      <section className="bg-paper py-24">
        <Container>
          <SectionHead
            eyebrow="As mais amadas"
            title="Bestsellers"
            link={{ label: 'Ver ranking completo', href: '/aneis' as never }}
          />
          <ProductGrid products={featured.slice(0, 4)} />
        </Container>
      </section>

      <RevendedoraSection />

      <ValueProps />
      <Newsletter />
    </>
  );
}
