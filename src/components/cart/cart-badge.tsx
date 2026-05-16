'use client';

import { useCart } from '@/lib/providers/cart-provider';
import { Icon } from '@/components/ui/icon';

interface Props {
  onClick?: () => void;
  size?: number;
}

export function CartBadge({ onClick, size = 20 }: Props) {
  const { totalItems, open } = useCart();
  return (
    <button
      type="button"
      onClick={onClick ?? open}
      aria-label={`Sacola${totalItems > 0 ? ` com ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`}
      className="relative text-ink transition-colors hover:text-ink-60"
    >
      <Icon name="bag" size={size} />
      {totalItems > 0 && (
        <span className="font-mono nums absolute -top-2 -right-2 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1.5 text-[10px] font-semibold text-paper ring-2 ring-paper">
          {totalItems}
        </span>
      )}
    </button>
  );
}
