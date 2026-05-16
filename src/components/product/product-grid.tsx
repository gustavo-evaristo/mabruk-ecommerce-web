import type { Product } from '@/lib/api/types';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils/cn';

interface ProductGridProps {
  products: Product[];
  cols?: 2 | 3 | 4;
  className?: string;
}

const colsClasses = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
} as const;

export function ProductGrid({ products, cols = 4, className }: ProductGridProps) {
  return (
    <div className={cn('grid gap-x-8 gap-y-12', colsClasses[cols], className)}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
