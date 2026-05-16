import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1600&q=80';
const HERO_INSET =
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=80';

export function Hero() {
  return (
    <section className="relative bg-cream">
      <Container className="grid min-h-[680px] items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
        <div className="flex flex-col gap-7 py-16">
          <div className="eyebrow-hero">Coleção Outono · Inverno</div>
          <h1 className="text-display-lg leading-tight tracking-tight">
            O brilho que
            <br />
            <span className="em-italic">permanece</span>
          </h1>
          <p className="max-w-[460px] text-body-xl leading-relaxed text-ink-60">
            Semijoias com banho de ouro 18k e ródio, desenhadas para acompanhar as histórias
            que importam.
          </p>
          <div className="mt-2 flex gap-3">
            <Link href="/aneis">
              <Button variant="primary" size="lg">
                Comprar agora
              </Button>
            </Link>
            <Link href={'/colecao/oasis' as never}>
              <Button
                variant="ghost"
                size="lg"
                iconRight={<Icon name="arrowRight" size={14} />}
              >
                Conhecer coleção
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex gap-8 border-t border-ink/10 pt-8">
            {[
              { label: 'Banho de', value: 'Ouro 18k' },
              { label: 'Garantia', value: '12 meses' },
              { label: 'Frete grátis acima', value: 'R$ 300,00' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <div className="eyebrow !text-ink-60">{s.label}</div>
                <div className="font-display text-lead">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[620px]">
          <div className="absolute top-0 left-0 h-full w-[72%] overflow-hidden">
            <Image
              src={HERO_IMAGE}
              alt="Modelo usando colar da Coleção Lumière"
              fill
              priority
              sizes="(min-width: 1280px) 600px, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 bg-paper/95 px-5 py-3 backdrop-blur-sm">
              <div className="eyebrow !text-ink-60">Em destaque</div>
              <div className="mt-1 font-display text-h6">Colar Pingente Lumière</div>
              <div className="font-mono nums text-body-sm text-ink-80">
                R$ 289,00 · até 6x sem juros
              </div>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 h-[46%] w-[40%] overflow-hidden shadow-[-20px_-20px_0_var(--color-cream)]">
            <Image
              src={HERO_INSET}
              alt="Detalhe de joia em fundo cream"
              fill
              sizes="(min-width: 1280px) 280px, 30vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
