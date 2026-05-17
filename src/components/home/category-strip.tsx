import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import type { Category } from '@/lib/api/types';
import { Container } from '@/components/ui/container';

const CATEGORY_IMAGES: Record<string, string> = {
  aneis: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
  brincos:
    'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=400&q=80',
  colares:
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
  pulseiras:
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
  braceletes:
    'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=400&q=80',
  tornozeleiras:
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80',
  conjuntos:
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
};

interface Props {
  categories: Category[];
}

export function CategoryStrip({ categories }: Props) {
  return (
    <section className="border-b border-line bg-paper py-10 lg:py-16">
      <Container>
        <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-6 md:gap-x-12 md:gap-y-10">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}` as Route}
              className="liftable flex flex-col items-center gap-3"
            >
              <div className="relative size-20 overflow-hidden rounded-full bg-cream md:size-28">
                <Image
                  src={CATEGORY_IMAGES[cat.slug] ?? CATEGORY_IMAGES.aneis}
                  alt={cat.name}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
              <span className="text-eyebrow-sm font-medium uppercase tracking-eyebrow md:text-eyebrow md:tracking-eyebrow-lg">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
