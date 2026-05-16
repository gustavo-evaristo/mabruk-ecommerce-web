import { listProducts } from '@/lib/api/endpoints/products';
import { ProductGrid } from '@/components/product/product-grid';

export default async function FavoritosPage() {
  // Mock: pega os 6 primeiros produtos como "favoritos"
  const data = await listProducts({ pageSize: 6 });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-h3">Favoritos</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          {data.items.length} peças salvas. Quando estiver pronta, mova para a sacola.
        </p>
      </div>
      <ProductGrid products={data.items} cols={3} />
    </div>
  );
}
