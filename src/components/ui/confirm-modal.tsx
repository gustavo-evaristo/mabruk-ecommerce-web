'use client';

import { useEffect, useRef } from 'react';
import { Button } from './button';
import { Icon } from './icon';

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onCancel();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md bg-paper shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b border-line p-5">
          <div
            className={`flex size-9 items-center justify-center ${
              tone === 'danger'
                ? 'bg-[rgba(140,58,46,0.1)] text-sale'
                : 'bg-cream text-ink'
            }`}
          >
            <Icon name={tone === 'danger' ? 'trash' : 'bell'} size={18} />
          </div>
          <div className="flex-1">
            <h2 id="confirm-modal-title" className="text-body font-medium">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-body-sm text-ink-60">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Aguarde…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
