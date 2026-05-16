import Link from 'next/link';
import type { Route } from 'next';
import { cn } from '@/lib/utils/cn';
import { Icon } from './icon';

interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  link?: { label: string; href: Route };
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHead({ eyebrow, title, link, align = 'left', className }: SectionHeadProps) {
  return (
    <div
      className={cn(
        'mb-10 flex items-end justify-between gap-6',
        align === 'center' && 'flex-col items-center text-center',
        className,
      )}
    >
      <div>
        {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
        <h2 className="text-h2 leading-tight">{title}</h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex items-center gap-2 border-b border-current pb-0.5 text-eyebrow font-medium uppercase tracking-eyebrow-lg text-ink"
        >
          {link.label}
          <Icon name="arrowRight" size={11} />
        </Link>
      )}
    </div>
  );
}
