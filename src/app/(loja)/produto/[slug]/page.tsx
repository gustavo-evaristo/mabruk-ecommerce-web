import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Route } from 'next';
import { getProductBySlug, listRelatedProducts } from '@/lib/api/endpoints/products';
import { Container } from '@/components/ui/container';
import { ProductView } from '@/components/product/product-view';
import { ProductTabs } from '@/components/product/product-tabs';
import { ProductGrid } from '@/components/product/product-grid';
import { SectionHead } from '@/components/ui/section-head';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return product
    ? {
        title: product.seoTitle ?? product.name,
        description: product.seoDescription ?? product.description ?? undefined,
      }
    : { title: 'Produto' };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const related = await listRelatedProducts(slug);

  return (
    <>
      <Container className="pt-6">
        <nav className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
          <Link href="/">Início</Link>
          <span className="mx-2">/</span>
          <Link href={`/${product.category.slug}` as Route}>{product.category.name}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </Container>

      <Container className="grid gap-8 py-6 pb-16 lg:grid-cols-[1fr_480px] lg:gap-10 lg:pb-24">
        <ProductView product={product} />
      </Container>

      <ProductTabs product={product} />

      {related.length > 0 && (
        <section className="bg-cream py-14 lg:py-20">
          <Container>
            <SectionHead eyebrow="Combine com" title="Você pode gostar" align="left" />
            <ProductGrid products={related.slice(0, 4)} />
          </Container>
        </section>
      )}
    </>
  );
}
