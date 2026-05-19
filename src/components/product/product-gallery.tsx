'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/lib/api/types';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

interface Props {
  images: ProductImage[];
  productName: string;
  /** Quando passado, prioriza imagens vinculadas a essa variante e mostra fotos globais como fallback. */
  selectedVariantId?: string | null;
}

const FALLBACK_IMAGE: ProductImage = {
  id: 'fallback',
  url: '',
  alt: '',
  order: 0,
  variantId: null,
};

/** Decide quais imagens mostrar baseado na variante selecionada. */
function pickImages(images: ProductImage[], selectedVariantId: string | null | undefined) {
  if (!selectedVariantId) {
    // Sem variante selecionada → mostra tudo
    return images.length > 0 ? images : [FALLBACK_IMAGE];
  }
  const ofVariant = images.filter((i) => i.variantId === selectedVariantId);
  if (ofVariant.length > 0) {
    // Tem fotos da variante → mostra elas primeiro + fotos globais como complemento
    const globals = images.filter((i) => i.variantId == null);
    return [...ofVariant, ...globals];
  }
  // Sem fotos pra essa variante → fallback nas globais (ou todas)
  const globals = images.filter((i) => i.variantId == null);
  return globals.length > 0 ? globals : images.length > 0 ? images : [FALLBACK_IMAGE];
}

export function ProductGallery({ images, productName, selectedVariantId }: Props) {
  const list = useMemo(
    () => pickImages(images, selectedVariantId),
    [images, selectedVariantId],
  );
  const [active, setActive] = useState(0);

  // Quando a variante mudar e a lista trocar, reseta pra primeira foto
  useEffect(() => {
    setActive(0);
  }, [selectedVariantId]);

  const current = list[active] ?? list[0];

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Thumbs — coluna vertical em desktop, scroll horizontal em mobile */}
      <div className="order-2 flex shrink-0 gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:gap-3 lg:overflow-visible">
        {list.map((img, i) => (
          <button
            key={img.id + '-' + i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative h-[80px] w-16 shrink-0 overflow-hidden border bg-cream lg:h-[100px] lg:w-20',
              i === active ? 'border-ink' : 'border-line',
            )}
          >
            {img.url ? (
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-ink-40">
                <Icon name="box" size={18} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="order-1 flex-1 lg:order-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          {current?.url ? (
            <Image
              src={current.url}
              alt={current.alt ?? productName}
              fill
              priority
              sizes="(min-width: 1280px) 600px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-ink-40">
              <Icon name="box" size={64} />
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-body-xs text-ink-60">
          <span className="hidden sm:inline">Passe o mouse para aplicar zoom</span>
          <span className="font-mono nums ml-auto">
            {active + 1} / {list.length}
          </span>
        </div>
      </div>
    </div>
  );
}
