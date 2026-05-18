import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  subtitle?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
}

export function AdminPageHeader({ subtitle, title, action }: AdminPageHeaderProps) {
  const hasTitle = Boolean(title);
  if (!hasTitle && !action) return null;

  return (
    <div
      className={`flex items-center gap-6 border-b border-line bg-paper px-10 ${
        hasTitle ? 'py-6' : 'py-3.5'
      } ${hasTitle ? 'justify-between' : 'justify-end'}`}
    >
      {hasTitle && (
        <div>
          {subtitle && (
            <div className="mb-1.5 text-eyebrow font-medium uppercase tracking-eyebrow-lg text-ink-60">
              {subtitle}
            </div>
          )}
          <h1 className="font-display text-[36px] leading-none font-normal">{title}</h1>
        </div>
      )}
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
