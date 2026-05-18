'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';
import { toggleFavoriteAction } from '@/lib/auth/customer-actions';

interface Props {
  productId: string;
  initialIsFavorite?: boolean;
  size?: number;
  className?: string;
  variant?: 'overlay' | 'inline';
}

export function FavoriteButton({
  productId,
  initialIsFavorite = false,
  size = 16,
  className,
  variant = 'overlay',
}: Props) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [pending, startTransition] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const prev = isFav;
    setIsFav(!prev); // optimistic
    startTransition(async () => {
      const res = await toggleFavoriteAction(productId, prev);
      if (res.authRequired) {
        router.push('/entrar');
        return;
      }
      if (!res.ok) {
        setIsFav(prev); // revert on failure
      } else {
        setIsFav(res.isFavorite);
      }
    });
  }

  const base =
    variant === 'overlay'
      ? 'grid place-items-center rounded-full bg-paper/95 backdrop-blur transition-opacity hover:bg-paper'
      : 'inline-flex items-center justify-center transition-colors';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      aria-pressed={isFav}
      className={cn(
        base,
        variant === 'overlay' && 'size-9 cursor-pointer',
        isFav ? 'text-sale' : 'text-ink hover:text-sale',
        className,
      )}
    >
      <Icon name={isFav ? 'heartFill' : 'heart'} size={size} />
    </button>
  );
}
