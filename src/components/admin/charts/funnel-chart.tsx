const STAGES = [
  { stage: 'Visitas', n: '8.421', pct: '100', w: 100, final: false },
  { stage: 'Produto visto', n: '4.210', pct: '50', w: 72, final: false },
  { stage: 'Add to cart', n: '824', pct: '9,8', w: 42, final: false },
  { stage: 'Checkout', n: '410', pct: '4,9', w: 26, final: false },
  { stage: 'Compra', n: '284', pct: '3,4', w: 18, final: true },
];

export function FunnelChart() {
  return (
    <div className="flex flex-col gap-2 p-5">
      {STAGES.map((s) => (
        <div
          key={s.stage}
          className="grid items-center gap-2 text-body-xs"
          style={{ gridTemplateColumns: '100px 1fr 44px' }}
        >
          <span className="text-ink-60">{s.stage}</span>
          <div className="h-[18px] bg-cream">
            <div
              className={`flex h-full items-center justify-end pr-2 text-[10px] text-paper ${
                s.final ? 'bg-success' : 'bg-ink'
              }`}
              style={{ width: `${s.w}%` }}
            >
              {s.n}
            </div>
          </div>
          <span className="text-right font-semibold">{s.pct}%</span>
        </div>
      ))}
    </div>
  );
}
