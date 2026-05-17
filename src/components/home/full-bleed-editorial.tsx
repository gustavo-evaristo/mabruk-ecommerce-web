import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';

export function FullBleedEditorial() {
  return (
    <section className="relative min-h-[440px] overflow-hidden bg-ink text-paper lg:min-h-[640px]">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=2000&q=80"
          alt="Editorial Mabruk"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-transparent lg:from-ink/70 lg:via-ink/20" />
      </div>
      <div className="relative mx-auto flex min-h-[440px] max-w-[1320px] items-center px-6 py-16 lg:min-h-[640px] lg:px-10 lg:py-32">
        <div className="flex max-w-xl flex-col gap-5 lg:gap-6">
          <div className="eyebrow-hero !text-paper/70">Editorial</div>
          <h2 className="font-display text-[44px] leading-[1.05] tracking-tight text-paper sm:text-[60px] lg:text-display lg:leading-tight">
            <span className="em-italic !text-paper">Atenção</span>
            <br />
            aos detalhes
          </h2>
          <p className="max-w-[440px] text-body-md leading-relaxed text-paper/75 lg:text-body-lg">
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
