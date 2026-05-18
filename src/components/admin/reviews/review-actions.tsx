'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  approveReviewAction,
  rejectReviewAction,
  deleteReviewAction,
} from '@/lib/auth/admin-extras-actions';

interface Props {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export function ReviewActions({ id, status }: Props) {
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn();
    });
  }

  return (
    <div className="flex gap-2">
      {status !== 'APPROVED' && (
        <Button
          variant="primary"
          size="sm"
          disabled={pending}
          onClick={() => run(() => approveReviewAction(id))}
        >
          Aprovar
        </Button>
      )}
      {status !== 'REJECTED' && (
        <Button
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => run(() => rejectReviewAction(id))}
        >
          Rejeitar
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        onClick={() => {
          if (confirm('Excluir avaliação?')) run(() => deleteReviewAction(id));
        }}
        icon={<Icon name="trash" size={12} />}
      >
        Excluir
      </Button>
    </div>
  );
}
