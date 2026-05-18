'use client';

import { useStoreConfig } from '@/lib/providers/store-config-provider';
import { formatMoney } from '@/lib/utils/format';

/**
 * Barra fina preta no topo do site com mensagem promocional.
 * Valores vêm de /b2c/store-config via StoreConfigProvider.
 */
export function TopBar() {
  const { freeShippingThresholdCents, maxInstallments } = useStoreConfig();
  return (
    <div className="flex h-7 items-center justify-center bg-ink px-3 text-paper lg:h-[33px]">
      <p className="text-center text-[10px] font-medium uppercase tracking-eyebrow lg:text-eyebrow-xs lg:tracking-eyebrow-lg">
        Frete grátis acima de {formatMoney(freeShippingThresholdCents)} · até {maxInstallments}x sem juros
      </p>
    </div>
  );
}
