export type Tier = 'Member' | 'Insider' | 'Diamond';

const TIER_CONFIG: Record<Tier, string> = {
  Diamond: 'bg-ink text-paper',
  Insider: 'bg-champagne text-ink',
  Member: 'bg-cream text-ink',
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span
      className={`inline-flex self-start px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${TIER_CONFIG[tier]}`}
    >
      {tier}
    </span>
  );
}
