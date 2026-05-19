'use client';

import { useState } from 'react';
import type { ProductDetails } from '@/lib/api/types';
import { ProductGallery } from './product-gallery';
import { ProductPdpForm } from './product-pdp-form';

interface Props {
  product: ProductDetails;
}

/**
 * Wrapper Client da PDP. Mantém o estado da variante selecionada e propaga
 * tanto pro form (preço/estoque/atributos) quanto pra galeria (filtra fotos da variante).
 */
export function ProductView({ product }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  return (
    <>
      <ProductGallery
        images={product.images}
        productName={product.name}
        selectedVariantId={selectedVariantId}
      />
      <ProductPdpForm product={product} onVariantChange={setSelectedVariantId} />
    </>
  );
}
