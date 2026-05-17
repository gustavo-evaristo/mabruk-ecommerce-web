import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function CollectionBlock() {
  return (
    <section className="bg-cream">
      <Container className="grid items-stretch gap-0 px-0 md:min-h-[640px] md:grid-cols-[1.1fr_1fr]">
        <div className="relative min-h-[320px] overflow-hidden md:min-h-[640px]">
          <Image
            src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=80"
            alt="Coleção Oásis · editorial"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute top-4 left-4 bg-paper px-3 py-1.5 text-eyebrow-sm font-medium uppercase tracking-eyebrow md:top-6 md:left-6">
            Coleção da estação
          </div>
        </div>
        <div className="flex flex-col justify-center gap-5 px-6 py-12 md:gap-6 md:px-16 md:py-20">
          <div className="eyebrow-hero">Coleção Oásis</div>
          <h2 className="font-display text-[36px] leading-[1.05] md:text-[60px] md:leading-tight">
            Atemporal,
            <br />
            <span className="em-italic">como o ouro</span>
          </h2>
          <p className="max-w-[460px] text-body-md leading-relaxed text-ink-60 md:text-body-lg">
            Doze peças desenhadas em torno de uma ideia simples: a beleza que não envelhece.
            Banho de ouro 18k em camadas, acabamento à mão por artesãos brasileiros.
          </p>
          <div className="mt-2 flex gap-3">
            <Link href={'/colecao/oasis' as Route}>
              <Button variant="primary">Explorar coleção</Button>
            </Link>
          </div>
          <div className="mt-4 flex gap-8 border-t border-ink/10 pt-5 md:mt-6 md:gap-12 md:pt-6">
            {[
              { value: '12', label: 'Peças exclusivas' },
              { value: '18k', label: 'Banho de ouro' },
              { value: '3μ', label: 'Camadas' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-h4 md:text-h3">{s.value}</div>
                <div className="eyebrow mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
