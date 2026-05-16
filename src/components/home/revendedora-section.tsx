import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=80';

const STATS = [
  { value: 'R$ 0,00', label: 'Investimento inicial' },
  { value: '35-45%', label: 'Comissão por venda' },
  { value: 'Brasil', label: 'Atendimento nacional' },
];

export function RevendedoraSection() {
  return (
    <section className="bg-paper">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-stretch md:grid-cols-[1.05fr_1fr]">
        {/* Esquerda — imagem com badge */}
        <div className="relative min-h-[420px] overflow-hidden bg-cream md:min-h-[520px]">
          <Image
            src={IMAGE_URL}
            alt="Programa de consignação Mabruk"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute top-6 left-6 border border-line bg-paper px-3.5 py-1.5 text-eyebrow-sm font-medium uppercase tracking-eyebrow text-ink">
            Programa de consignação
          </div>
        </div>

        {/* Direita — copy */}
        <div className="flex flex-col justify-center gap-7 px-10 py-16 md:px-16">
          <div className="eyebrow-hero">Mabruk para você</div>
          <h2 className="font-display text-display-sm leading-tight tracking-tight">
            Seja uma
            <br />
            <span className="em-italic">revendedora</span>
          </h2>
          <p className="max-w-[480px] text-body-lg leading-relaxed text-ink-60">
            Comece sem investimento inicial. Você recebe um mostruário em consignação e fatura
            sobre o que vender — com margens generosas e o suporte de uma marca que já é desejo.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link href={'/revendedoras' as Route}>
              <Button variant="primary">Quero ser revendedora</Button>
            </Link>
            <Link href={'/revendedoras#como-funciona' as Route}>
              <Button variant="ghost" iconRight={<Icon name="arrowRight" size={14} />}>
                Como funciona
              </Button>
            </Link>
          </div>
          <div className="mt-6 flex gap-6 border-t border-ink/10 pt-7 md:gap-10">
            {STATS.map((s) => (
              <div key={s.label} className="min-w-0 flex-1">
                <div className="font-display text-h3 leading-none">{s.value}</div>
                <div className="eyebrow mt-2 whitespace-nowrap">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
