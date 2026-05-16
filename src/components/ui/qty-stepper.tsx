'use client';

import { Icon } from './icon';
import { cn } from '@/lib/utils/cn';

interface QtyStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QtyStepper({ value, onChange, min = 1, max = 99, className }: QtyStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('inline-flex items-center border border-line', className)}>
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
        className="grid size-10 place-items-center text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="minus" size={14} />
      </button>
      <span className="grid w-10 place-items-center font-mono nums text-body">{value}</span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
        className="grid size-10 place-items-center text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
