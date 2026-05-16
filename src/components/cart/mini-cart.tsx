'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

const BANHO_LABEL: Record<string, string> = {
  OURO_18K: 'Ouro 18k',
  RODIO: 'Prata 925',
  OURO_ROSE: 'Ouro rosé',
};

export function MiniCart() {
  const { items, isOpen, close, subtotalCents, removeItem } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden
        className={cn(
          'fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* Drawer */}
      <aside
        aria-hidden={!isOpen}
        className={cn(
          'fixed top-0 right-0 z-[61] flex h-full w-full max-w-md flex-col bg-paper shadow-modal transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-h5">Sua sacola</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar"
            className="text-ink transition-colors hover:text-ink-60"
          >
            <Icon name="close" size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Icon name="bag" size={40} className="text-ink-40" />
            <h3 className="font-display text-h5">Sua sacola está vazia</h3>
            <p className="text-body-sm text-ink-60">
              Comece a montar a sua composição.
            </p>
            <Link href="/aneis" onClick={close}>
              <Button variant="primary">Explorar peças</Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.itemId} className="flex gap-4 py-5">
                  <div className="relative size-20 shrink-0 bg-cream">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/produto/${item.productSlug}` as never}
                      onClick={close}
                      className="font-display text-body-xl leading-tight hover:underline"
                    >
                      {item.productName}
                    </Link>
                    <div className="mt-1 text-body-xs text-ink-60">
                      {BANHO_LABEL[item.banho] ?? item.banho} · {item.size}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-mono nums text-body-sm">
                        {item.quantity} × {formatMoney(item.unitPriceCents)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.itemId)}
                        className="text-ink-60 hover:text-ink"
                        aria-label="Remover"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line bg-cream px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-body-sm text-ink-60">Subtotal</span>
                <span className="font-display text-h5">{formatMoney(subtotalCents)}</span>
              </div>
              <div className="mt-1 text-body-xs text-ink-60">
                Frete e impostos calculados no checkout
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link href={'/carrinho' as never} onClick={close}>
                  <Button variant="primary" fullWidth>
                    Ir para a sacola
                  </Button>
                </Link>
                <Link href={'/checkout' as never} onClick={close}>
                  <Button variant="secondary" fullWidth>
                    Finalizar compra
                  </Button>
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
