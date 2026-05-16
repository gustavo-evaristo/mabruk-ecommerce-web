import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

export function FullBleedEditorial() {
  return (
    <section className="relative min-h-[640px] overflow-hidden bg-ink text-paper">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=2000&q=80"
          alt="Editorial Mabruk"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[640px] max-w-[1320px] items-center px-10 py-32">
        <div className="flex max-w-xl flex-col gap-6">
          <div className="eyebrow-hero !text-paper/70">Editorial</div>
          <h2 className="font-display text-display leading-tight tracking-tight text-paper">
            <span className="em-italic !text-paper">Atenção</span>
            <br />
            aos detalhes
          </h2>
          <p className="max-w-[440px] text-body-lg leading-relaxed text-paper/75">
            Cada peça nasce de um croqui à mão e passa por dezenas de horas de acabamento. O
            brilho que você vê é resultado de três camadas de banho em ouro 18k.
          </p>
          <div className="mt-3">
            <Link
              href={'/sobre' as Route}
              className="btn-pill inline-block bg-paper px-7 py-3.5 text-body-sm text-ink"
            >
              Nossa história
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
