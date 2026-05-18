import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ProductGrid } from '@/components/product/product-grid';
import { getAuthToken } from '@/lib/auth/session';
import { listMyFavorites } from '@/lib/api/endpoints/favorites';

export default async function FavoritosPage() {
  const token = await getAuthToken();
  if (!token) redirect('/entrar');

  const favorites = await listMyFavorites(token).catch(() => []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-h3">Favoritos</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          {favorites.length === 0
            ? 'Clique no coração nos produtos para salvar aqui.'
            : `${favorites.length} ${favorites.length === 1 ? 'peça salva' : 'peças salvas'}. Quando estiver pronta, mova para a sacola.`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 border border-dashed border-line bg-paper py-16 text-center">
          <Icon name="heart" size={36} className="text-ink-40" />
          <h3 className="font-display text-h5">Sua lista está vazia</h3>
          <p className="max-w-sm text-body-sm text-ink-60">
            Comece a navegar e toque no coração para guardar as peças que você ama.
          </p>
          <Link href={'/' as Route}>
            <Button variant="primary" size="sm" iconRight={<Icon name="arrowRight" size={12} />}>
              Explorar peças
            </Button>
          </Link>
        </div>
      ) : (
        <ProductGrid products={favorites} cols={3} allFavorited />
      )}
    </div>
  );
}
