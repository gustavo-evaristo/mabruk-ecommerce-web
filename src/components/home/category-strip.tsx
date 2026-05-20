import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import type { Category } from '@/lib/api/types';
import { Icon } from '@/components/ui/icon';
import { Container } from '@/components/ui/container';

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
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="(min-width:768px) 112px, 80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-ink-40">
                    <Icon name="box" size={28} />
                  </div>
                )}
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
