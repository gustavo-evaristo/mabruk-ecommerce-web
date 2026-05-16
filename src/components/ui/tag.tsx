import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'default' | 'sale' | 'new' | 'line' | 'success' | 'champagne';

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-cream text-ink-60',
  sale: 'bg-sale text-paper',
  new: 'bg-ink text-paper',
  line: 'border border-line text-ink-60',
  success: 'bg-success text-paper',
  champagne: 'bg-champagne text-ink',
};

export function Tag({ variant = 'default', className, children, ...rest }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-eyebrow-sm font-medium uppercase tracking-eyebrow',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
