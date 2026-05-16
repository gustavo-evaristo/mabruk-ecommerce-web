import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

/**
 * Container padrão Mabruk: max-width 1320px, padding lateral 40px (desktop).
 */
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('container-mabruk', className)} {...rest} />;
}
