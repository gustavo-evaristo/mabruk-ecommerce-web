import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Card({ title, action, children, className, bodyClassName }: CardProps) {
  return (
    <div className={cn('border border-line bg-paper', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          {title && (
            <div className="text-eyebrow font-medium uppercase tracking-eyebrow-lg">{title}</div>
          )}
          {action}
        </div>
      )}
      <div className={cn('p-6', bodyClassName)}>{children}</div>
    </div>
  );
}
