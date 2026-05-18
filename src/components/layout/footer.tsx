import Link from 'next/link';
import type { Route } from 'next';
import { Container } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { Logo } from './logo';
import { listCategories } from '@/lib/api/endpoints/categories';
import { listCollections } from '@/lib/api/endpoints/collections';

const STATIC_COLUMNS: { title: string; links: { label: string; href: Route }[] }[] = [
  {
    title: 'Mabruk',
    links: [
      { label: 'Sobre', href: '/sobre' as Route },
      { label: 'Cuidados', href: '/cuidados' as Route },
      { label: 'Garantia', href: '/garantia' as Route },
      { label: 'Atendimento', href: '/atendimento' as Route },
    ],
  },
  {
    title: 'Sua conta',
    links: [
      { label: 'Entrar', href: '/entrar' as Route },
      { label: 'Pedidos', href: '/conta/pedidos' as Route },
      { label: 'Favoritos', href: '/conta/favoritos' as Route },
      { label: 'Endereços', href: '/conta/enderecos' as Route },
    ],
  },
  {
    title: 'Ajuda',
    links: [
      { label: 'Trocas e devoluções', href: '/trocas' as Route },
      { label: 'Política de privacidade', href: '/privacidade' as Route },
      { label: 'Termos de uso', href: '/termos' as Route },
    ],
  },
];

export async function Footer() {
  const [categories, collections] = await Promise.all([
    listCategories().catch(() => []),
    listCollections().catch(() => []),
  ]);

  const lojaLinks: { label: string; href: Route }[] = [
    ...categories.slice(0, 5).map((c) => ({
      label: c.name,
      href: `/${c.slug}` as Route,
    })),
  ];
  if (collections.length > 0) {
    lojaLinks.push({ label: 'Coleções', href: '/colecoes' as Route });
  }

  const columns = [
    ...(lojaLinks.length > 0 ? [{ title: 'Loja', links: lojaLinks }] : []),
    ...STATIC_COLUMNS,
  ];

  return (
    <footer className="border-t border-line bg-paper">
      <Container className="py-12 lg:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo size={28} />
            <p className="mt-6 max-w-xs text-body-sm leading-relaxed text-ink-60">
              Joias atemporais para o dia a dia. Banho ouro 18k, prata 925 e aço inoxidável
              com garantia.
            </p>
            <Link
              href={'https://www.instagram.com' as Route}
              aria-label="Instagram"
              className="mt-6 inline-flex items-center gap-2 text-ink transition-colors hover:text-ink-60"
            >
              <Icon name="instagram" size={18} />
              <span className="text-eyebrow font-medium uppercase tracking-eyebrow">@mabruk</span>
            </Link>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink">
                {col.title}
              </h4>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-ink-60 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-body-xs text-ink-60 md:flex-row">
          <p>© {new Date().getFullYear()} Mabruk Semijoias. Todos os direitos reservados.</p>
          <p className="font-mono nums">CNPJ 00.000.000/0001-00</p>
        </div>
      </Container>
    </footer>
  );
}
