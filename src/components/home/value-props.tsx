'use client';

import { Container } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { useStoreConfig } from '@/lib/providers/store-config-provider';
import { formatMoney } from '@/lib/utils/format';

export function ValueProps() {
  const { freeShippingThresholdCents, maxInstallments } = useStoreConfig();

  const props = [
    {
      icon: 'truck' as const,
      title: 'Frete grátis',
      desc: `Acima de ${formatMoney(freeShippingThresholdCents)}, todo o Brasil`,
    },
    {
      icon: 'pkg' as const,
      title: 'Embalagem presente',
      desc: 'Caixa Mabruk em todas as compras',
    },
    {
      icon: 'creditCard' as const,
      title: 'Parcelamento',
      desc: `Em até ${maxInstallments}x sem juros no cartão`,
    },
    {
      icon: 'check' as const,
      title: 'Garantia 12 meses',
      desc: 'Contra defeitos de fabricação',
    },
  ];

  return (
    <section className="bg-ink py-12 text-paper lg:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:gap-12 md:grid-cols-4">
          {props.map((p) => (
            <div key={p.title} className="flex flex-col gap-3">
              <Icon name={p.icon} size={28} stroke={1} className="text-cream" />
              <div className="font-display text-h6">{p.title}</div>
              <div className="text-body-sm text-paper/60">{p.desc}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
