import { Icon } from './icon';
import { cn } from '@/lib/utils/cn';

interface StarsProps {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}

export function Stars({ value, count, size = 14, className }: StarsProps) {
  const rounded = Math.round(value);
  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5 text-champagne-dark">
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon key={i} name={i <= rounded ? 'starFill' : 'star'} size={size} />
        ))}
      </div>
      {count !== undefined && (
        <span className="ml-1 font-mono nums text-body-xs text-ink-60">({count})</span>
      )}
    </div>
  );
}
