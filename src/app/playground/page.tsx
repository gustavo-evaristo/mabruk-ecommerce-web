import { SiteHeader, Footer } from '@/components/layout';
import { Button, Container, Icon, QtyStepperDemo, Stars, Tag } from './_parts';
import { formatMoney } from '@/lib/utils/format';

/**
 * Página de visualização dos primitivos do design system.
 * Acesso: http://localhost:3001/playground
 * Útil enquanto Etapa 2 está em andamento; pode ser removida depois.
 */
export default function PlaygroundPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-paper">
        <Container className="py-16">
          <div className="mb-12">
            <p className="eyebrow-hero">Design System</p>
            <h1 className="mt-2 text-h1">
              Mabruk <span className="em-italic">Playground</span>
            </h1>
            <p className="mt-4 max-w-xl text-body-md text-ink-60">
              Inventário visual dos tokens e primitivos. Use esta página para verificar fontes,
              cores e componentes durante o desenvolvimento.
            </p>
          </div>

          {/* Tipografia */}
          <Section title="Tipografia">
            <div className="space-y-6">
              <h1 className="text-display-lg">
                O brilho que <em className="em-italic">permanece</em>
              </h1>
              <h2 className="text-display-sm">Display Small (60px)</h2>
              <h3 className="text-h1">H1 — 56px Cormorant</h3>
              <h3 className="text-h2">H2 — 40px Cormorant</h3>
              <h3 className="text-h3">H3 — 32px Cormorant</h3>
              <p className="eyebrow">Eyebrow · maiúsculas finas</p>
              <p className="text-body-md">
                Body 14px — fonte Manrope, padrão de UI e parágrafos.{' '}
                <span className="em-italic">Atenção aos detalhes</span>, sempre.
              </p>
              <p className="font-mono nums text-body-lg">{formatMoney(28900)} · MAB-CO-0314</p>
            </div>
          </Section>

          {/* Cores */}
          <Section title="Cores">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Swatch name="ink" hex="#0A0A0A" textColor="text-paper" />
              <Swatch name="ink-80" hex="#2A2622" textColor="text-paper" />
              <Swatch name="ink-60" hex="#6B6660" textColor="text-paper" />
              <Swatch name="ink-40" hex="#9A938A" textColor="text-paper" />
              <Swatch name="cream" hex="#F8F5F0" />
              <Swatch name="paper" hex="#FFFFFF" />
              <Swatch name="line" hex="#E8E2D8" />
              <Swatch name="champagne" hex="#D9C9A8" />
              <Swatch name="champagne-dark" hex="#A8946F" textColor="text-paper" />
              <Swatch name="rose" hex="#C9A8A0" />
              <Swatch name="success" hex="#3D6A4E" textColor="text-paper" />
              <Swatch name="sale" hex="#8C3A2E" textColor="text-paper" />
            </div>
          </Section>

          {/* Botões */}
          <Section title="Botões">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Comprar agora</Button>
              <Button variant="secondary">Conhecer coleção</Button>
              <Button variant="light">Adicionar à sacola</Button>
              <Button variant="ghost" iconRight={<Icon name="arrowRight" size={14} />}>
                Ver mais
              </Button>
              <Button variant="danger">Cancelar pedido</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm" variant="primary">
                Pequeno
              </Button>
              <Button size="md" variant="primary">
                Médio (padrão)
              </Button>
              <Button size="lg" variant="primary">
                Grande
              </Button>
              <Button variant="primary" disabled>
                Desabilitado
              </Button>
            </div>
          </Section>

          {/* Tags */}
          <Section title="Tags">
            <div className="flex flex-wrap gap-3">
              <Tag>Padrão</Tag>
              <Tag variant="new">Novidade</Tag>
              <Tag variant="sale">-30%</Tag>
              <Tag variant="line">Edição limitada</Tag>
              <Tag variant="champagne">Insider</Tag>
              <Tag variant="success">Entregue</Tag>
            </div>
          </Section>

          {/* Ícones */}
          <Section title="Ícones">
            <div className="grid grid-cols-6 gap-4 md:grid-cols-10">
              {(
                [
                  'search',
                  'user',
                  'bag',
                  'heart',
                  'heartFill',
                  'menu',
                  'close',
                  'arrowRight',
                  'arrowLeft',
                  'chevronDown',
                  'chevronRight',
                  'plus',
                  'minus',
                  'check',
                  'star',
                  'starFill',
                  'truck',
                  'creditCard',
                  'pix',
                  'lock',
                  'map',
                  'pkg',
                  'edit',
                  'trash',
                  'eye',
                  'filter',
                  'grid',
                  'list',
                  'instagram',
                  'play',
                ] as const
              ).map((n) => (
                <div key={n} className="flex flex-col items-center gap-2 text-ink">
                  <Icon name={n} size={22} />
                  <span className="font-mono text-eyebrow-xs text-ink-60">{n}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Stars + QtyStepper */}
          <Section title="Outros">
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col gap-2">
                <p className="eyebrow">Stars</p>
                <Stars value={4} count={47} />
              </div>
              <div className="flex flex-col gap-2">
                <p className="eyebrow">QtyStepper</p>
                <QtyStepperDemo />
              </div>
            </div>
          </Section>
        </Container>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-16 border-t border-line pt-10">
      <h2 className="mb-6 text-h4">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  textColor = 'text-ink',
}: {
  name: string;
  hex: string;
  textColor?: string;
}) {
  return (
    <div className="overflow-hidden border border-line">
      <div className="aspect-[5/3]" style={{ background: hex }} />
      <div className="flex items-center justify-between bg-paper p-3">
        <span className="text-body-sm">{name}</span>
        <span className={`font-mono text-eyebrow-xs text-ink-60 ${textColor === 'text-paper' ? '' : ''}`}>
          {hex}
        </span>
      </div>
    </div>
  );
}
