import type { ReactNode } from 'react';

interface LabeledFieldProps {
  label: string;
  optional?: boolean;
  children: ReactNode;
}

export function LabeledField({ label, optional, children }: LabeledFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
        {label}
        {optional && (
          <span className="ml-1.5 normal-case tracking-normal text-ink-40">(opcional)</span>
        )}
      </label>
      {children}
    </div>
  );
}
