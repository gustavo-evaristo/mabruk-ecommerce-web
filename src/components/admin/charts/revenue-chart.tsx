export function RevenueChart() {
  return (
    <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="h-[200px] w-full">
      <defs>
        <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0A0A" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const y = 12 + 164 * (1 - t);
        return (
          <g key={t}>
            <line
              x1={36}
              y1={y}
              x2={792}
              y2={y}
              stroke="#E8E2D8"
              strokeDasharray={t === 0 ? '0' : '2 4'}
            />
            <text
              x={28}
              y={y + 3}
              textAnchor="end"
              fontSize="9"
              fontFamily="Manrope"
              fill="#9A938A"
            >
              {Math.round(30 * t)}k
            </text>
          </g>
        );
      })}
      <path
        d="M36 175 L 62 172 L 88 168 L 114 165 L 140 160 L 166 158 L 192 154 L 218 150 L 244 147 L 270 143 L 296 140 L 322 136 L 348 133 L 374 130 L 400 126 L 426 124 L 452 120 L 478 117 L 504 114 L 530 110 L 556 108 L 582 104 L 608 102 L 634 98 L 660 96 L 686 92 L 712 90 L 738 88 L 764 86 L 790 84"
        fill="none"
        stroke="#9A938A"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <path
        d="M36 165 L 62 168 L 88 158 L 114 162 L 140 152 L 166 156 L 192 144 L 218 148 L 244 138 L 270 130 L 296 134 L 322 122 L 348 126 L 374 114 L 400 108 L 426 112 L 452 100 L 478 95 L 504 88 L 530 92 L 556 80 L 582 74 L 608 68 L 634 72 L 660 60 L 686 54 L 712 48 L 738 42 L 764 35 L 790 28 L 790 188 L 36 188 Z"
        fill="url(#dashArea)"
      />
      <path
        d="M36 165 L 62 168 L 88 158 L 114 162 L 140 152 L 166 156 L 192 144 L 218 148 L 244 138 L 270 130 L 296 134 L 322 122 L 348 126 L 374 114 L 400 108 L 426 112 L 452 100 L 478 95 L 504 88 L 530 92 L 556 80 L 582 74 L 608 68 L 634 72 L 660 60 L 686 54 L 712 48 L 738 42 L 764 35 L 790 28"
        fill="none"
        stroke="#0A0A0A"
        strokeWidth="1.8"
      />
      <circle cx="790" cy="28" r="4" fill="#0A0A0A" />
      <circle cx="790" cy="28" r="8" fill="#0A0A0A" fillOpacity="0.15" />
    </svg>
  );
}
