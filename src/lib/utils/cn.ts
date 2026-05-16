import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Junta classNames condicionais e resolve conflitos de Tailwind.
 * Uso: `<div className={cn('p-4', isActive && 'bg-gold', extraClasses)} />`
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
