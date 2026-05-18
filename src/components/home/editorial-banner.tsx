import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { Icon } from '@/components/ui/icon';
import type { Category, Collection } from '@/lib/api/types';

interface Panel {
  title: string;
  imageUrl: string;
  href: Route;
  dark?: boolean;
}

// Imagens de fallback rotacionadas para categorias sem cover image cadastrada
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80',
];

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=80';

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

interface Props {
  categories: Category[];
  featuredCollection: Collection | null;
}

export function EditorialBanner({ categories, featuredCollection }: Props) {
  const top4 = categories.slice(0, 4);
  // Se não tem categorias nem coleção em destaque, não renderiza nada
  if (top4.length === 0 && !featuredCollection) return null;

  const panels: Panel[] = top4.map((c, i) => ({
    title: c.name,
    imageUrl: FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
    href: `/${c.slug}` as Route,
    dark: i % 3 === 1,
  }));
  const panelsMid = panels.slice(0, 2);
  const panelsRight = panels.slice(2, 4);

  const heroHref = featuredCollection
    ? (`/colecao/${featuredCollection.slug}` as Route)
    : top4[0]
      ? (`/${top4[0].slug}` as Route)
      : ('/' as Route);
  const heroImage = featuredCollection?.coverImageUrl ?? FALLBACK_HERO_IMAGE;
  const heroTitle = featuredCollection?.name ?? 'Mabruk';
  const heroDesc =
    featuredCollection?.description ??
    'Peças leves para começar o dia. Linhas finas, brilho discreto.';

  // Calcula colunas: hero + 2 colunas se tem 4 panels, senão menos
  const gridCols =
    panels.length >= 4
      ? 'md:grid-cols-[1.4fr_1fr_1fr]'
      : panels.length >= 2
        ? 'md:grid-cols-[1.4fr_1fr]'
        : 'md:grid-cols-1';

  return (
    <section className="border-y border-line bg-paper">
      <div className={`mx-auto grid w-full max-w-[1440px] grid-cols-1 ${gridCols}`}>
        {/* Hero pane à esquerda */}
        <Link
          href={heroHref}
          className="relative block min-h-[340px] overflow-hidden border-b border-line md:min-h-[520px] md:border-b-0"
        >
          <Image
            src={heroImage}
            alt={`Editorial Mabruk · ${heroTitle}`}
            fill
            sizes="(min-width: 1280px) 600px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent" />
          <div className="absolute right-6 bottom-6 left-6 text-paper md:right-10 md:bottom-10 md:left-10">
            <div className="eyebrow-hero !text-paper/80">
              {featuredCollection ? 'Coleção em destaque' : 'Editorial'}
            </div>
            <h3 className="mt-3 font-display text-[32px] leading-none md:text-[44px]">
              {heroTitle}
            </h3>
            <p className="mt-3 max-w-xs text-body leading-relaxed opacity-90">{heroDesc}</p>
            <span className="mt-4 inline-block border-b border-paper pb-0.5 text-eyebrow font-medium uppercase tracking-eyebrow-lg">
              {featuredCollection ? 'Ver coleção' : 'Ver loja'}
            </span>
          </div>
        </Link>

        {panelsMid.length > 0 && (
          <div className="flex flex-col">
            {panelsMid.map((p) => (
              <PanelCard key={p.title} panel={p} />
            ))}
          </div>
        )}
        {panelsRight.length > 0 && (
          <div className="flex flex-col">
            {panelsRight.map((p) => (
              <PanelCard key={p.title} panel={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
