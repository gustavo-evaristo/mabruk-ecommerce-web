import Link from 'next/link';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ADMIN_PRODUCTS } from '@/lib/mock/admin';

interface Props {
  params: Promise<{ id: string }>;
}

const TAGS = ['minimalista', 'banho-ouro-18k', 'presente', 'best-seller', 'novidade'];

const VARIANTS = [
  { name: 'Ouro 18k · 40cm', sku: 'MAB-CO-0314-A', price: '289,00', stock: 8 },
  { name: 'Ouro 18k · 45cm', sku: 'MAB-CO-0314-B', price: '289,00', stock: 6 },
  { name: 'Prata 925 · 40cm', sku: 'MAB-CO-0314-C', price: '259,00', stock: 12 },
  { name: 'Prata 925 · 45cm', sku: 'MAB-CO-0314-D', price: '259,00', stock: 9 },
  { name: 'Aço inox · 40cm', sku: 'MAB-CO-0314-E', price: '189,00', stock: 14 },
  { name: 'Aço inox · 45cm', sku: 'MAB-CO-0314-F', price: '189,00', stock: 0 },
];

const VISIBILITY = [
  { label: 'Loja online', checked: true },
  { label: 'Destaque na home', checked: true },
  { label: 'Bestsellers', checked: false },
  { label: 'Novidades', checked: true },
];

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const p = ADMIN_PRODUCTS.find((it) => it.id === id);
  return { title: `${p?.name ?? 'Produto'} — Mabruk Admin` };
}

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const p = ADMIN_PRODUCTS.find((it) => it.id === id) ?? ADMIN_PRODUCTS[0];

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/produtos' as Route} className="hover:text-ink">
              Produtos
            </Link>
            <Icon name="chevronRight" size={10} />
            <span className="text-ink">Editar</span>
          </span>
        }
        title={p.name}
        action={
          <>
            <label className="flex items-center gap-2 text-body-sm text-ink-60">
              <span className="relative inline-block h-5 w-9 cursor-pointer rounded-full bg-success">
                <span className="absolute top-0.5 left-4.5 size-4 rounded-full bg-paper" />
              </span>
              Publicado
            </label>
            <Link href={'/admin/produtos' as Route}>
              <Button variant="secondary" size="md">Cancelar</Button>
            </Link>
            <Button variant="primary" size="md">Salvar alterações</Button>
          </>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
        <div className="flex flex-col gap-6">
          <Card title="Informações básicas">
            <div className="flex flex-col gap-4">
              <LabeledField label="Nome do produto">
                <input defaultValue={p.name} />
              </LabeledField>
              <LabeledField label="Descrição">
                <textarea
                  rows={4}
                  defaultValue="Peça atemporal da Mabruk, com acabamento artesanal e banho premium. Vem em embalagem de presente."
                />
              </LabeledField>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <LabeledField label="Categoria">
                  <select defaultValue={p.category}>
                    <option>Colares</option>
                    <option>Anéis</option>
                    <option>Brincos</option>
                    <option>Pulseiras</option>
                    <option>Conjuntos</option>
                    <option>Braceletes</option>
                    <option>Tornozeleiras</option>
                  </select>
                </LabeledField>
                <LabeledField label="Coleção">
                  <select defaultValue={p.collection}>
                    <option>Oásis</option>
                    <option>Celeste</option>
                    <option>Solar</option>
                    <option>Minimal</option>
                  </select>
                </LabeledField>
              </div>
              <LabeledField label="Tags">
                <div className="flex min-h-11 flex-wrap items-center gap-2 border border-line p-2.5">
                  {TAGS.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 bg-cream px-2.5 py-1 text-eyebrow"
                    >
                      {t}
                      <Icon name="close" size={10} />
                    </span>
                  ))}
                  <input
                    placeholder="adicionar tag..."
                    className="!h-auto !w-32 !border-0 !p-0 !py-1"
                  />
                </div>
              </LabeledField>
            </div>
          </Card>

          <Card>
            <div className="mb-5">
              <div className="font-display text-h6 font-medium">Fotos e vídeo</div>
              <div className="mt-1 text-eyebrow text-ink-60">
                Recomendado: 5 fotos · 1200 × 1500 px · 1 vídeo até 30s
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-[4/5] border border-line bg-cream">
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-ink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-paper">
                      Capa
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 grid size-6 place-items-center bg-paper/90"
                  >
                    <Icon name="close" size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="flex aspect-[4/5] flex-col items-center justify-center gap-2 border border-dashed border-ink-20 bg-cream"
              >
                <Icon name="plus" size={20} className="text-ink-40" />
                <span className="text-[10px] uppercase tracking-wide text-ink-60">
                  Adicionar
                </span>
              </button>
            </div>
          </Card>

          <Card>
            <div className="mb-5">
              <div className="font-display text-h6 font-medium">Variações & estoque</div>
              <div className="mt-1 text-eyebrow text-ink-60">
                Tamanhos, banhos e disponibilidade
              </div>
            </div>

            <LabeledField label="Opções">
              <div className="flex flex-wrap gap-2">
                <span className="bg-cream px-3 py-1.5 text-eyebrow">Banho · 3 valores</span>
                <span className="bg-cream px-3 py-1.5 text-eyebrow">Tamanho · 2 valores</span>
                <button
                  type="button"
                  className="border border-dashed border-ink-20 px-3 py-1.5 text-eyebrow text-ink-60"
                >
                  + Adicionar opção
                </button>
              </div>
            </LabeledField>

            <div className="mt-4 border border-line">
              <div
                className="hidden gap-4 bg-cream px-4 py-2.5 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 md:grid"
                style={{ gridTemplateColumns: '1.5fr 100px 100px 100px 40px' }}
              >
                <span>Variação</span>
                <span>SKU</span>
                <span className="text-right">Preço</span>
                <span className="text-right">Estoque</span>
                <span />
              </div>
              {VARIANTS.map((v) => (
                <div
                  key={v.sku}
                  className="grid items-center gap-3 border-t border-line px-4 py-3 text-body-sm md:gap-4"
                  style={{ gridTemplateColumns: '1.5fr 100px 100px 100px 40px' }}
                >
                  <span className="font-medium">{v.name}</span>
                  <span className="font-mono text-eyebrow text-ink-60">{v.sku}</span>
                  <input
                    defaultValue={v.price}
                    className="!h-9 !bg-cream !py-1.5 !text-right !text-body-sm font-mono"
                  />
                  <input
                    defaultValue={String(v.stock)}
                    className={`!h-9 !py-1.5 !text-right !text-body-sm font-mono ${
                      v.stock === 0
                        ? '!border-sale !bg-[rgba(140,58,46,0.08)] !text-sale'
                        : '!bg-cream'
                    }`}
                  />
                  <button
                    type="button"
                    className="grid size-7 place-items-center text-ink-40 hover:text-sale"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-eyebrow text-ink-60">
              <span>6 variações · 49 unidades totais em estoque</span>
              <button type="button" className="underline">
                Editar em massa
              </button>
            </div>
          </Card>

          <Card title="Especificações técnicas">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: 'Material base', value: 'Latão hipoalergênico' },
                { label: 'Banho', value: 'Ouro 18k · 3 micras' },
                { label: 'Peso unitário', value: '2.8 g' },
                { label: 'Comprimento', value: '45 cm' },
                { label: 'Pedra', value: 'Zircônia transparente' },
                { label: 'Garantia', value: '12 meses' },
              ].map((f) => (
                <LabeledField key={f.label} label={f.label}>
                  <input defaultValue={f.value} />
                </LabeledField>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Preços">
            <div className="flex flex-col gap-4">
              <LabeledField label="Preço de venda">
                <div className="relative">
                  <span className="font-mono pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-body-sm text-ink-60">
                    R$
                  </span>
                  <input defaultValue="289,00" className="font-mono !pl-10" />
                </div>
              </LabeledField>
              <LabeledField label="Preço promocional" optional>
                <div className="relative">
                  <span className="font-mono pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-body-sm text-ink-60">
                    R$
                  </span>
                  <input placeholder="0,00" className="font-mono !pl-10" />
                </div>
              </LabeledField>
              <LabeledField label="Preço de custo" optional>
                <div className="relative">
                  <span className="font-mono pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-body-sm text-ink-60">
                    R$
                  </span>
                  <input defaultValue="98,00" className="font-mono !pl-10" />
                </div>
              </LabeledField>
              <div className="flex justify-between border-t border-line pt-3 text-body-sm">
                <span className="text-ink-60">Margem</span>
                <span className="font-mono font-medium text-success">+ 66,1%</span>
              </div>
            </div>
          </Card>

          <Card title="Organização">
            <div className="flex flex-col gap-4">
              <LabeledField label="Visibilidade">
                <div className="flex flex-col gap-1.5">
                  {VISIBILITY.map((o) => (
                    <label
                      key={o.label}
                      className="flex items-center gap-2.5 text-body-sm"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={o.checked}
                        className="!w-auto !m-0"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </LabeledField>
              <LabeledField label="Slug da URL">
                <input
                  defaultValue="colar-pingente-lumiere"
                  className="font-mono !text-body-xs"
                />
              </LabeledField>
            </div>
          </Card>

          <Card>
            <div className="mb-3">
              <div className="font-display text-h6 font-medium">SEO</div>
              <div className="mt-1 text-eyebrow text-ink-60">
                Como aparece no Google
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <LabeledField label="Meta título">
                <input defaultValue="Colar Pingente Lumière · Ouro 18k · Mabruk" />
              </LabeledField>
              <LabeledField label="Meta descrição">
                <textarea
                  rows={3}
                  defaultValue="Colar minimalista com pingente em gota, banho de ouro 18k. Frete grátis acima de R$ 299."
                />
              </LabeledField>
            </div>
          </Card>

          <div className="bg-cream p-5 text-body-sm leading-relaxed text-ink-60">
            <strong className="mb-1.5 block text-ink">Histórico</strong>
            Criado em 04 jan 2026 por Mariana A.
            <br />
            Última edição há 3 dias.
          </div>
        </div>
      </div>
    </>
  );
}
