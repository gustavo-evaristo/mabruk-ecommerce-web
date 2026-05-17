import { notFound } from 'next/navigation';
import { listCategories } from '@/lib/api/endpoints/categories';
import { listCollections } from '@/lib/api/endpoints/collections';
import { listTags } from '@/lib/api/endpoints/tags';
import { listProducts } from '@/lib/api/endpoints/products';
import { Container } from '@/components/ui/container';
import { FilterSidebar } from '@/components/plp/filter-sidebar';
import { FilterDrawer } from '@/components/plp/filter-drawer';
import { CategoryView } from '@/components/plp/category-view';

interface Props {
  params: Promise<{ categoria: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { categoria } = await params;
  const cats = await listCategories();
  const cat = cats.find((c) => c.slug === categoria);
  return { title: cat ? `${cat.name}` : 'Categoria' };
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params;
  const [categories, collections, tags, result] = await Promise.all([
    listCategories(),
    listCollections(),
    listTags(),
    listProducts({ category: categoria, pageSize: 30 }),
  ]);

  const cat = categories.find((c) => c.slug === categoria);
  if (!cat) notFound();

  return (
    <Container className="grid gap-6 py-8 lg:grid-cols-[240px_1fr] lg:gap-12 lg:py-12">
      {/* Mobile: drawer trigger */}
      <div className="lg:hidden">
        <FilterDrawer
          categories={categories}
          collections={collections}
          tags={tags}
          activeCategorySlug={cat.slug}
        />
      </div>

      {/* Desktop: sidebar fixa */}
      <div className="hidden lg:block">
        <FilterSidebar
          categories={categories}
          collections={collections}
          tags={tags}
          activeCategorySlug={cat.slug}
        />
      </div>

      <CategoryView
        products={result.items}
        total={result.total}
        totalPages={result.totalPages}
      />
    </Container>
  );
}
