'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';
import { toggleFavoriteAction } from '@/lib/auth/customer-actions';
import { queryKeys } from '@/lib/hooks';

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
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (currentIsFavorite: boolean) => {
      return toggleFavoriteAction(productId, currentIsFavorite);
    },
    onMutate: async (currentIsFavorite) => {
      // Optimistic flip
      return { previousIsFavorite: currentIsFavorite, optimisticIsFavorite: !currentIsFavorite };
    },
    onSuccess: (res) => {
      if (res.authRequired) {
        router.push('/entrar');
        return;
      }
      // Invalida lista de favoritos pra refletir mudança
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
    },
  });

  // Estado mostrado: optimistic durante mutation, depois resposta do server, depois prop inicial.
  const isFav = mutation.isPending
    ? !(mutation.variables ?? false)
    : mutation.data && !mutation.data.authRequired
      ? mutation.data.isFavorite
      : initialIsFavorite;

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate(isFav);
  }

  const base =
    variant === 'overlay'
      ? 'grid place-items-center rounded-full bg-paper/95 backdrop-blur transition-opacity hover:bg-paper'
      : 'inline-flex items-center justify-center transition-colors';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={mutation.isPending}
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
