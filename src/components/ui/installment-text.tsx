'use client';

import { formatMoney, installmentValue } from '@/lib/utils/format';
import { useStoreConfig } from '@/lib/providers/store-config-provider';

interface Props {
  priceCents: number;
  /** Override do prefixo "ou Nx de R$ X,XX sem juros". */
  prefix?: string;
}

/**
 * Renderiza "ou {N}x de {R$ X,XX} sem juros" usando o número máximo de parcelas
 * configurado no admin (settings.payment.maxInstallments). Client Component
 * pra ler o context — pode ser usado dentro de Server Components.
 */
export function InstallmentText({ priceCents, prefix = 'ou' }: Props) {
  const { maxInstallments } = useStoreConfig();
  if (!maxInstallments || maxInstallments < 2) return null;
  return (
    <>
      {prefix}{' '}
      <span className="font-mono nums">{maxInstallments}x</span> de{' '}
      <span className="font-mono nums">
        {formatMoney(installmentValue(priceCents, maxInstallments))}
      </span>{' '}
      sem juros
    </>
  );
}

/**
 * Versão compacta: "em até Nx sem juros" (sem cálculo de valor da parcela).
 */
export function InstallmentBadge() {
  const { maxInstallments } = useStoreConfig();
  if (!maxInstallments || maxInstallments < 2) return null;
  return <>em até {maxInstallments}x sem juros</>;
}

export function MaxInstallments() {
  const { maxInstallments } = useStoreConfig();
  return <>{maxInstallments}</>;
}

export function FreeShippingThreshold() {
  const { freeShippingThresholdCents } = useStoreConfig();
  return <>{formatMoney(freeShippingThresholdCents)}</>;
}
