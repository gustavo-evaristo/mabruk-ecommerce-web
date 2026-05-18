interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  borderLeft?: boolean;
}

export function KpiCard({ label, value, delta, positive = true, borderLeft }: KpiCardProps) {
  return (
    <div className={`px-5 py-4.5 ${borderLeft ? 'border-l border-line' : ''}`}>
      <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">{label}</div>
      <div className="mt-2 text-[20px] font-semibold tracking-tight whitespace-nowrap">{value}</div>
      {delta && (
        <div
          className={`mt-1 text-eyebrow font-semibold ${
            positive ? 'text-success' : 'text-sale'
          }`}
        >
          {positive ? '↑' : '↓'} {delta.replace(/^[+-]/, '')}
        </div>
      )}
    </div>
  );
}
