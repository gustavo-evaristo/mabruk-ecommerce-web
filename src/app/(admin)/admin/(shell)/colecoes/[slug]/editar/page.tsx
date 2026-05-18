'use client';

import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_COLLECTIONS, ADMIN_PRODUCTS } from '@/lib/mock/admin';

type Tab = 'content' | 'pieces' | 'gallery' | 'seo';

const TABS: { id: Tab; label: string; icon: IconName; count?: number }[] = [
  { id: 'content', label: 'Conteúdo', icon: 'edit' },
  { id: 'pieces', label: 'Peças', icon: 'box', count: 8 },
  { id: 'gallery', label: 'Galeria editorial', icon: 'eye' },
  { id: 'seo', label: 'SEO', icon: 'star' },
];

const PALETTES = [
  { name: 'Cream', color: '#F8F5F0' },
  { name: 'Champagne', color: '#EFE4CE', active: true },
  { name: 'Rose', color: '#F4E8E4' },
  { name: 'Ink', color: '#1a1816', dark: true },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CollectionEditPage({ params }: Props) {
  const { slug } = use(params);
  const [tab, setTab] = useState<Tab>('content');
  const [active, setActive] = useState(true);
  const collection = ADMIN_COLLECTIONS.find((c) => c.slug === slug) ?? ADMIN_COLLECTIONS[0];
  const pieces = ADMIN_PRODUCTS.slice(0, 6);

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/colecoes' as Route} className="hover:text-ink">
              Coleções
            </Link>
            <Icon name="chevronRight" size={10} />
            <span className="text-ink">Editar</span>
          </span>
        }
        title={`Coleção ${collection.name}`}
        action={
          <>
            <label className="flex items-center gap-2 text-body-sm text-ink-60">
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative inline-block h-5 w-9 rounded-full ${
                  active ? 'bg-success' : 'bg-ink-20'
                }`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-paper ${
                    active ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
              {active ? 'Publicada' : 'Rascunho'}
            </label>
            <Button variant="secondary" size="md" icon={<Icon name="eye" size={14} />}>
              Pré-visualizar
            </Button>
            <Button variant="primary" size="md">Salvar alterações</Button>
          </>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
        <div className="flex flex-col gap-4">
          <div className="flex border border-line bg-paper">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-5 py-4 text-eyebrow uppercase tracking-eyebrow-lg ${
                  tab === t.id
                    ? 'border-ink bg-cream font-semibold text-ink'
                    : 'border-transparent text-ink-60 hover:text-ink'
                }`}
              >
                <Icon name={t.icon} size={14} />
                {t.label}
                {t.count && (
                  <span className="font-mono text-[10px] opacity-60">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {tab === 'content' && (
            <>
              <Card title="Informações básicas">
                <div className="flex flex-col gap-4">
                  <LabeledField label="Nome da coleção">
                    <input defaultValue={collection.name} />
                  </LabeledField>
                  <LabeledField label="Eyebrow">
                    <input defaultValue="Coleção 03" />
                  </LabeledField>
                  <LabeledField label="Tagline">
                    <input defaultValue="Atemporal, como o ouro" />
                  </LabeledField>
                  <LabeledField label="História / descrição">
                    <textarea
                      rows={5}
                      defaultValue={collection.description}
                    />
                  </LabeledField>
                </div>
              </Card>

              <Card title="Tema visual">
                <LabeledField label="Paleta de fundo do hero">
                  <div className="flex flex-wrap gap-2.5">
                    {PALETTES.map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        className={`flex items-center gap-2 border px-3.5 py-3 text-eyebrow uppercase tracking-wide ${
                          p.active ? 'border-ink' : 'border-line'
                        }`}
                        style={{ background: p.color, color: p.dark ? '#fff' : undefined }}
                      >
                        <span
                          className="size-4.5 border border-black/15"
                          style={{ background: p.color }}
                        />
                        {p.name}
                      </button>
                    ))}
                  </div>
                </LabeledField>
              </Card>
            </>
          )}

          {tab === 'pieces' && (
            <Card
              title={`Peças da coleção (${pieces.length})`}
              action={
                <Button variant="primary" size="sm" icon={<Icon name="plus" size={12} />}>
                  Adicionar peças
                </Button>
              }
            >
              <div className="flex flex-col">
                {pieces.map((p, i) => (
                  <div
                    key={p.id}
                    className={`grid items-center gap-4 py-3.5 ${
                      i < pieces.length - 1 ? 'border-b border-line' : ''
                    }`}
                    style={{ gridTemplateColumns: '24px 80px 1fr 100px 90px 80px 40px' }}
                  >
                    <Icon name="menu" size={14} className="cursor-grab text-ink-40" />
                    <div className="h-[76px] w-16 bg-cream" />
                    <div>
                      <div className="font-display text-[16px]">{p.name}</div>
                      <div className="mt-1 font-mono text-[10px] text-ink-60">{p.sku}</div>
                    </div>
                    <span className="text-right font-mono text-body-sm">
                      {formatMoney(p.price)}
                    </span>
                    <span className="inline-flex self-start bg-[rgba(61,106,78,0.08)] px-2.5 py-1 text-[10px] tracking-wide text-success">
                      {p.stock} em estoque
                    </span>
                    <span className="text-eyebrow text-ink-60">
                      {p.sales30d} vendas/mês
                    </span>
                    <button type="button" className="text-ink-60 hover:text-sale">
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'gallery' && (
            <Card title="Galeria editorial">
              <LabeledField label="Foto principal do hero (1440 × 1080)">
                <div className="relative aspect-[4/3] max-w-[600px] border border-line bg-cream">
                  <button
                    type="button"
                    className="absolute top-3 right-3 bg-paper/90 px-3 py-1.5 text-eyebrow uppercase tracking-eyebrow"
                  >
                    Substituir
                  </button>
                </div>
              </LabeledField>
              <div className="mt-6">
                <LabeledField label="Mood strip (3 imagens)">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="relative aspect-square border border-line bg-cream"
                      >
                        <button
                          type="button"
                          className="absolute top-2 right-2 grid size-6 place-items-center bg-paper/90"
                        >
                          <Icon name="edit" size={12} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-ink-20 bg-cream"
                    >
                      <Icon name="plus" size={20} className="text-ink-40" />
                      <span className="text-[10px] uppercase tracking-wide text-ink-60">
                        Adicionar
                      </span>
                    </button>
                  </div>
                </LabeledField>
              </div>
            </Card>
          )}

          {tab === 'seo' && (
            <Card title="SEO">
              <div className="flex flex-col gap-4">
                <LabeledField label="Slug da URL">
                  <input className="font-mono" defaultValue={`colecao-${collection.slug}`} />
                </LabeledField>
                <LabeledField label="Meta título">
                  <input defaultValue={`Coleção ${collection.name} · Mabruk Semijoias`} />
                </LabeledField>
                <LabeledField label="Meta descrição">
                  <textarea rows={3} defaultValue={collection.description} />
                </LabeledField>
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Período">
            <div className="flex flex-col gap-4">
              <LabeledField label="Lançamento">
                <input type="date" defaultValue="2026-05-15" />
              </LabeledField>
              <LabeledField label="Encerramento" optional>
                <input type="date" />
              </LabeledField>
            </div>
          </Card>

          <Card title="Destaque">
            <div className="flex flex-col gap-3 text-body-sm">
              <label className="flex items-center gap-2.5">
                <input type="checkbox" defaultChecked className="!w-auto !m-0" />
                Mostrar na home
              </label>
              <label className="flex items-center gap-2.5">
                <input type="checkbox" defaultChecked className="!w-auto !m-0" />
                Aparece no mega-menu
              </label>
              <label className="flex items-center gap-2.5">
                <input type="checkbox" className="!w-auto !m-0" />
                Edição limitada
              </label>
            </div>
          </Card>

          <Card title="Performance">
            <div className="flex flex-col gap-3.5">
              {[
                ['Visitas', '4.281'],
                ['Add to cart', '624'],
                ['Vendas', '142'],
                ['Receita', 'R$ 27.840'],
                ['Conversão', '3,3%'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between text-body-sm"
                >
                  <span className="text-ink-60">{k}</span>
                  <span className="font-mono font-medium">{v}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-cream p-4.5 text-body-sm leading-relaxed text-ink-60">
            <strong className="mb-1.5 block text-ink">Histórico</strong>
            Criada em 12 jan 2026
            <br />
            Editada há 3 dias por Mariana A.
          </div>
        </div>
      </div>
    </>
  );
}
