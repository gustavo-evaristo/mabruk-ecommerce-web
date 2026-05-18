import { Header } from './header';
import { listCategories } from '@/lib/api/endpoints/categories';
import { listCollections } from '@/lib/api/endpoints/collections';

/**
 * Server wrapper que busca categorias e coleções da API e injeta
 * no `<Header>` client component. As próximas chamadas no mesmo request
 * são desduplicadas pelo cache do Next.
 */
export async function SiteHeader() {
  const [categories, collections] = await Promise.all([
    listCategories().catch(() => []),
    listCollections().catch(() => []),
  ]);

  return <Header categories={categories} collections={collections} />;
}
