import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Icon } from '@/components/ui/icon';
import { Logo } from './logo';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Loja',
    links: [
      { label: 'Anéis', href: '/aneis' },
      { label: 'Brincos', href: '/brincos' },
      { label: 'Colares', href: '/colares' },
      { label: 'Pulseiras', href: '/pulseiras' },
      { label: 'Coleções', href: '/colecoes' },
    ],
  },
  {
    title: 'Mabruk',
    links: [
      { label: 'Sobre', href: '/sobre' },
      { label: 'Cuidados', href: '/cuidados' },
      { label: 'Garantia', href: '/garantia' },
      { label: 'Atendimento', href: '/atendimento' },
    ],
  },
  {
    title: 'Sua conta',
    links: [
      { label: 'Entrar', href: '/entrar' },
      { label: 'Pedidos', href: '/conta/pedidos' },
      { label: 'Favoritos', href: '/conta/favoritos' },
      { label: 'Endereços', href: '/conta/enderecos' },
    ],
  },
  {
    title: 'Ajuda',
    links: [
      { label: 'Trocas e devoluções', href: '/trocas' },
      { label: 'Política de privacidade', href: '/privacidade' },
      { label: 'Termos de uso', href: '/termos' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <Container className="py-12 lg:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo size={28} />
            <p className="mt-6 max-w-xs text-body-sm leading-relaxed text-ink-60">
              Joias atemporais para o dia a dia. Banho ouro 18k, prata 925 e aço inoxidável com garantia.
            </p>
            <Link
              href="https://www.instagram.com"
              aria-label="Instagram"
              className="mt-6 inline-flex items-center gap-2 text-ink transition-colors hover:text-ink-60"
            >
              <Icon name="instagram" size={18} />
              <span className="text-eyebrow font-medium uppercase tracking-eyebrow">@mabruk</span>
            </Link>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink">
                {col.title}
              </h4>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as never}
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
