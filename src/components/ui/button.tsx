import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-4 text-eyebrow-xs',
  md: 'h-11 px-6 text-body-sm',
  lg: 'h-13 px-8 text-body',
};

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper border border-ink hover:bg-ink-80',
  secondary: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-cream',
  light: 'bg-paper text-ink border border-line hover:border-ink',
  danger: 'bg-transparent text-sale border border-sale hover:bg-sale hover:text-paper',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn-pill cursor-pointer rounded-sm disabled:cursor-not-allowed disabled:opacity-40',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
