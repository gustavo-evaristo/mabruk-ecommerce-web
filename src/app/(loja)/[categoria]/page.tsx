import { notFound } from 'next/navigation';
import { listCategories } from '@/lib/api/endpoints/categories';
import { listCollections } from '@/lib/api/endpoints/collections';
import { listTags } from '@/lib/api/endpoints/tags';
import { listProducts } from '@/lib/api/endpoints/products';
import { Container } from '@/components/ui/container';
import { FilterSidebar } from '@/components/plp/filter-sidebar';
import { SortBar } from '@/components/plp/sort-bar';
import { ProductGrid } from '@/components/product/product-grid';

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
    <>
      <SortBar totalCount={result.total} filtersOpen />

      <Container className="grid gap-12 py-12 lg:grid-cols-[240px_1fr]">
        <FilterSidebar
          categories={categories}
          collections={collections}
          tags={tags}
          activeCategorySlug={cat.slug}
        />

        <div>
          <header className="mb-10">
            <p className="eyebrow">Categoria</p>
            <h1 className="mt-2 font-display text-h1">{cat.name}</h1>
            <p className="mt-3 max-w-xl text-body-md text-ink-60">
              Toda a delicadeza Mabruk em {cat.name.toLowerCase()}. Banho ouro 18k e ródio com
              garantia de 12 meses.
            </p>
          </header>

          {result.items.length === 0 ? (
            <p className="py-24 text-center text-body-md text-ink-60">
              Nenhuma peça encontrada nesta categoria.
            </p>
          ) : (
            <>
              <ProductGrid products={result.items} cols={3} />
              {result.totalPages > 1 && (
                <nav className="mt-16 flex justify-center gap-3 text-body-sm">
                  {Array.from({ length: result.totalPages }).map((_, i) => (
                    <span
                      key={i}
                      className={`grid size-9 place-items-center border font-mono nums ${i === 0 ? 'border-ink bg-ink text-paper' : 'border-line'}`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );
}
