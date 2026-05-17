import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Icon } from '@/components/ui/icon';

interface Panel {
  title: string;
  imageUrl: string;
  href: Route;
  dark?: boolean;
}

const PANELS_RIGHT: Panel[] = [
  {
    title: 'Brincos',
    imageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80',
    href: '/brincos' as Route,
  },
  {
    title: 'Conjuntos',
    imageUrl:
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80',
    href: '/conjuntos' as Route,
    dark: true,
  },
];

const PANELS_MID: Panel[] = [
  {
    title: 'Anéis',
    imageUrl:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    href: '/aneis' as Route,
  },
  {
    title: 'Pulseiras',
    imageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    href: '/pulseiras' as Route,
  },
];

function PanelCard({ panel, ratio = 'normal' }: { panel: Panel; ratio?: 'normal' | 'tall' }) {
  const inkColor = panel.dark ? 'text-paper' : 'text-ink';
  return (
    <Link
      href={panel.href}
      className={`relative block overflow-hidden border-b border-line last:border-b-0 ${ratio === 'tall' ? 'min-h-[520px]' : 'min-h-[260px]'}`}
    >
      <Image
        src={panel.imageUrl}
        alt={panel.title}
        fill
        sizes="(min-width: 1280px) 30vw, 50vw"
        className="object-cover"
      />
      {panel.dark && (
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent" />
      )}
      <div className={`absolute bottom-6 left-6 ${inkColor}`}>
        <div className="font-display text-h5">{panel.title}</div>
        <div className="mt-1 inline-flex items-center gap-1.5 text-eyebrow-sm font-medium uppercase tracking-eyebrow">
          Explorar <Icon name="arrowRight" size={11} />
        </div>
      </div>
    </Link>
  );
}

export function EditorialBanner() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Pane grande à esquerda */}
        <Link
          href={'/colecao/oasis' as Route}
          className="relative block min-h-[340px] overflow-hidden border-b border-line md:min-h-[520px] md:border-b-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=80"
            alt="Editorial Mabruk · Manhãs douradas"
            fill
            sizes="(min-width: 1280px) 600px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent" />
          <div className="absolute right-6 bottom-6 left-6 text-paper md:right-10 md:bottom-10 md:left-10">
            <div className="eyebrow-hero !text-paper/80">Editorial · Maio</div>
            <h3 className="mt-3 font-display text-[32px] leading-none md:text-[44px]">
              <span className="em-italic">Manhãs</span>
              <br />
              douradas
            </h3>
            <p className="mt-3 max-w-xs text-body leading-relaxed opacity-90">
              Peças leves para começar o dia. Linhas finas, brilho discreto.
            </p>
            <span className="mt-4 inline-block border-b border-paper pb-0.5 text-eyebrow font-medium uppercase tracking-eyebrow-lg">
              Ver coleção
            </span>
          </div>
        </Link>

        <div className="flex flex-col">
          {PANELS_MID.map((p) => (
            <PanelCard key={p.title} panel={p} />
          ))}
        </div>
        <div className="flex flex-col">
          {PANELS_RIGHT.map((p) => (
            <PanelCard key={p.title} panel={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
