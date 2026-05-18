export type OrderStatus =
  | 'aguardando'
  | 'pago'
  | 'preparando'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

const ORDER_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  aguardando: {
    label: 'Aguardando pagamento',
    className: 'bg-[rgba(168,148,111,0.14)] text-champagne-dark',
  },
  pago: { label: 'Pago', className: 'bg-[rgba(61,106,78,0.1)] text-success' },
  preparando: { label: 'Em preparação', className: 'bg-cream text-ink-60' },
  enviado: { label: 'Enviado', className: 'bg-[rgba(10,10,10,0.06)] text-ink' },
  entregue: { label: 'Entregue', className: 'bg-[rgba(61,106,78,0.08)] text-success' },
  cancelado: { label: 'Cancelado', className: 'bg-[rgba(140,58,46,0.08)] text-sale' },
};

interface StatusBadgeProps {
  status: OrderStatus;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const cfg = ORDER_CONFIG[status];
  return (
    <span
      className={`inline-flex self-start px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${cfg.className}`}
    >
      {label ?? cfg.label}
    </span>
  );
}

export type PromoStatus = 'ativo' | 'agendado' | 'expirado' | 'pausado';

const PROMO_CONFIG: Record<PromoStatus, { label: string; className: string }> = {
  ativo: { label: 'Ativo', className: 'bg-[rgba(61,106,78,0.1)] text-success' },
  agendado: { label: 'Agendado', className: 'bg-ink text-paper' },
  expirado: { label: 'Expirado', className: 'bg-cream text-ink-60' },
  pausado: { label: 'Pausado', className: 'bg-[rgba(168,148,111,0.14)] text-champagne-dark' },
};

export function PromoBadge({ status }: { status: PromoStatus }) {
  const cfg = PROMO_CONFIG[status];
  return (
    <span
      className={`inline-flex self-start px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
