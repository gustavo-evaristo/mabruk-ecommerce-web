interface DonutSegment {
  color: string;
  label: string;
  count: number;
  dashLen: number;
  dashOffset: number;
}

const SEGMENTS: DonutSegment[] = [
  { color: '#A8946F', label: 'Aguardando', count: 12, dashLen: 45, dashOffset: 0 },
  { color: '#0A0A0A', label: 'Preparando', count: 24, dashLen: 88, dashOffset: -45 },
  { color: '#6B6660', label: 'Trânsito', count: 18, dashLen: 65, dashOffset: -133 },
  { color: '#3D6A4E', label: 'Entregue', count: 14, dashLen: 53, dashOffset: -198 },
];

export function OrderStatusDonut() {
  return (
    <div className="flex items-center gap-6 p-6">
      <svg viewBox="0 0 100 100" width="120" height="120" className="shrink-0">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#E8E2D8" strokeWidth="14" />
        {SEGMENTS.map((s) => (
          <circle
            key={s.label}
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${s.dashLen} 251`}
            strokeDashoffset={s.dashOffset}
            transform="rotate(-90 50 50)"
          />
        ))}
        <text
          x="50"
          y="52"
          textAnchor="middle"
          fontSize="13"
          fontFamily="Cormorant Garamond"
          fontWeight="500"
        >
          284
        </text>
        <text x="50" y="62" textAnchor="middle" fontSize="6" fill="#9A938A">
          pedidos
        </text>
      </svg>
      <div className="flex flex-1 flex-col gap-2.5">
        {SEGMENTS.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-body-xs">
            <span className="size-2 shrink-0" style={{ background: s.color }} />
            <span className="flex-1 text-ink-60">{s.label}</span>
            <span className="font-semibold">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
