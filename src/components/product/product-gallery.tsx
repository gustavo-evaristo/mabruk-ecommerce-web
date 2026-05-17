'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductImage } from '@/lib/api/types';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

interface Props {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  const list = images.length > 0 ? images : [{ id: 'fallback', url: '', alt: productName, order: 0, variantId: null }];
  const [active, setActive] = useState(0);
  const current = list[active] ?? list[0];

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Thumbs — coluna vertical em desktop, scroll horizontal em mobile */}
      <div className="order-2 flex shrink-0 gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:gap-3 lg:overflow-visible">
        {list.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'relative h-[80px] w-16 shrink-0 overflow-hidden border bg-cream lg:h-[100px] lg:w-20',
              i === active ? 'border-ink' : 'border-line',
            )}
          >
            {img.url ? (
              <Image src={img.url} alt={img.alt ?? productName} fill sizes="80px" className="object-cover" />
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
          {current.url ? (
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
