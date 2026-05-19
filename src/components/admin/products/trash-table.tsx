'use client';

import { useState, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import type { AdminProductSummary } from '@/lib/api/endpoints/admin';
import { formatMoney } from '@/lib/utils/format';
import {
  hardDeleteProductAction,
  restoreProductAction,
} from '@/lib/auth/admin-product-actions';

interface Props {
  items: AdminProductSummary[];
}

export function TrashTable({ items }: Props) {
  const queryClient = useQueryClient();
  const [pending, startTransition] = useTransition();
  const [confirmHard, setConfirmHard] = useState<AdminProductSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onRestore(p: AdminProductSummary) {
    setError(null);
    startTransition(async () => {
      const r = await restoreProductAction(p.id);
      if (r.error) setError(r.error);
      else await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    });
  }

  function onConfirmHardDelete() {
    if (!confirmHard) return;
    const target = confirmHard;
    setError(null);
    startTransition(async () => {
      const r = await hardDeleteProductAction(target.id);
      if (r.error) setError(r.error);
      else await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setConfirmHard(null);
    });
  }

  if (items.length === 0) {
    return (
      <div className="border border-line bg-paper px-5 py-16 text-center text-body-sm text-ink-60">
        A lixeira está vazia.
      </div>
    );
  }

  return (
    <div className="border border-line bg-paper">
      {error && (
        <div className="border-b border-line bg-[rgba(140,58,46,0.06)] px-4 py-2 text-body-sm text-sale">
          {error}
        </div>
      )}
      <div
        className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
        style={{ gridTemplateColumns: '60px 1fr 110px 220px' }}
      >
        <span />
        <span>Produto</span>
        <span className="text-right">Preço</span>
        <span className="text-right">Ações</span>
      </div>

      {items.map((p) => (
        <div
          key={p.id}
          className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm lg:gap-4 lg:grid-cols-[60px_1fr_110px_220px]"
        >
          <div className="size-12 bg-cream">
            {p.image?.url && (
              <img
                src={p.image.url}
                alt={p.image.alt ?? p.name}
                className="size-12 object-cover opacity-70"
              />
            )}
          </div>
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="mt-0.5 font-mono text-eyebrow text-ink-60">
              /{p.slug} · {p.category.name}
            </div>
          </div>
          <span className="text-right font-mono">{formatMoney(p.priceFromCents)}</span>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Icon name="arrowLeft" size={12} />}
              disabled={pending}
              onClick={() => onRestore(p)}
            >
              Restaurar
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              icon={<Icon name="trash" size={12} />}
              disabled={pending}
              onClick={() => setConfirmHard(p)}
            >
              Apagar
            </Button>
          </div>
        </div>
      ))}

      <ConfirmModal
        open={!!confirmHard}
        tone="danger"
        title="Apagar permanentemente?"
        description={
          confirmHard
            ? `"${confirmHard.name}" será removido do banco de dados. Esta ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Apagar para sempre"
        loading={pending}
        onConfirm={onConfirmHardDelete}
        onCancel={() => setConfirmHard(null)}
      />
    </div>
  );
}
