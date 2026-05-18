'use client';

import { useActionState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  attachInvoiceAction,
  attachTrackingAction,
  updateOrderStatusAction,
  type OrderActionState,
} from '@/lib/auth/admin-order-actions';
import type { OrderStatus } from '@/lib/api/types';

const INITIAL: OrderActionState = {};

interface NextStatusAction {
  status: OrderStatus;
  label: string;
}

function getNextActions(current: OrderStatus): NextStatusAction[] {
  switch (current) {
    case 'PENDING_PAYMENT':
      return [
        { status: 'PAID', label: 'Marcar como pago' },
        { status: 'CANCELED', label: 'Cancelar' },
      ];
    case 'PAID':
      return [
        { status: 'PREPARING', label: 'Iniciar preparação' },
        { status: 'CANCELED', label: 'Cancelar' },
      ];
    case 'PREPARING':
      return [{ status: 'SHIPPED', label: 'Marcar como enviado' }];
    case 'SHIPPED':
      return [{ status: 'DELIVERED', label: 'Marcar como entregue' }];
    default:
      return [];
  }
}

export function OrderStatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const actions = getNextActions(currentStatus);

  if (actions.length === 0) return null;

  function onClick(status: OrderStatus) {
    startTransition(async () => {
      await updateOrderStatusAction(orderId, status);
    });
  }

  return (
    <>
      {actions.map((a) => (
        <Button
          key={a.status}
          variant={a.status === 'CANCELED' ? 'ghost' : 'primary'}
          size="md"
          disabled={pending}
          onClick={() => onClick(a.status)}
          icon={a.status === 'SHIPPED' ? <Icon name="truck" size={14} /> : undefined}
        >
          {a.label}
        </Button>
      ))}
    </>
  );
}

export function InvoiceForm({
  orderId,
  current,
}: {
  orderId: string;
  current?: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    attachInvoiceAction.bind(null, orderId),
    INITIAL,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        type="text"
        name="invoiceNumber"
        defaultValue={current ?? ''}
        placeholder="Número da NF-e"
        className="font-mono"
      />
      {state.error && (
        <div className="text-eyebrow text-sale">{state.error}</div>
      )}
      {state.ok && (
        <div className="text-eyebrow text-success">NF anexada.</div>
      )}
      <Button type="submit" variant="secondary" size="sm" disabled={pending}>
        {pending ? 'Salvando…' : 'Salvar NF'}
      </Button>
    </form>
  );
}

export function TrackingForm({
  orderId,
  currentCode,
  currentCarrier,
}: {
  orderId: string;
  currentCode?: string | null;
  currentCarrier?: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    attachTrackingAction.bind(null, orderId),
    INITIAL,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input
        type="text"
        name="trackingCode"
        defaultValue={currentCode ?? ''}
        placeholder="Código de rastreio"
        className="font-mono"
      />
      <input
        type="text"
        name="carrier"
        defaultValue={currentCarrier ?? ''}
        placeholder="Transportadora (opcional)"
      />
      {state.error && (
        <div className="text-eyebrow text-sale">{state.error}</div>
      )}
      {state.ok && (
        <div className="text-eyebrow text-success">Rastreio anexado.</div>
      )}
      <Button type="submit" variant="secondary" size="sm" disabled={pending}>
        {pending ? 'Salvando…' : 'Salvar rastreio'}
      </Button>
    </form>
  );
}
