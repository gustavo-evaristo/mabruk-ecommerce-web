import { Container } from '@/components/ui/container';
import { Icon, type IconName } from '@/components/ui/icon';

const PROPS: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'truck', title: 'Frete grátis', desc: 'Acima de R$ 300,00, todo o Brasil' },
  { icon: 'pkg', title: 'Embalagem presente', desc: 'Caixa Mabruk em todas as compras' },
  { icon: 'creditCard', title: 'Parcelamento', desc: 'Em até 6x sem juros no cartão' },
  { icon: 'check', title: 'Garantia 12 meses', desc: 'Contra defeitos de fabricação' },
];

export function ValueProps() {
  return (
    <section className="bg-ink py-12 text-paper lg:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:gap-12 md:grid-cols-4">
          {PROPS.map((p) => (
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
