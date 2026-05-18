'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

interface Props {
  params: Promise<{ slug: string }>;
}

interface Block {
  type: string;
  label: string;
  icon: IconName;
  preview: string;
}

const BLOCKS: Block[] = [
  { type: 'hero', label: 'Hero', icon: 'home', preview: 'Seja uma revendedora' },
  { type: 'benefits', label: 'Grid de benefícios', icon: 'grid', preview: '6 cards · Sem investimento, comissão...' },
  { type: 'steps', label: 'Como funciona', icon: 'list', preview: '4 passos numerados (fundo escuro)' },
  { type: 'testimonials', label: 'Depoimentos', icon: 'users', preview: '3 cards com foto + citação' },
  { type: 'faq', label: 'FAQ', icon: 'bell', preview: '8 perguntas em accordion' },
  { type: 'cta', label: 'CTA final', icon: 'tag', preview: 'Pronta para começar? + botão' },
];

export default function LandingEditPage({ params }: Props) {
  const { slug } = use(params);
  const [active, setActive] = useState(true);
  const [selected, setSelected] = useState(0);

  const block = BLOCKS[selected];

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/banners' as Route} className="hover:text-ink">
              Landing pages
            </Link>
            <Icon name="chevronRight" size={10} />
            <span className="text-ink">Editar</span>
          </span>
        }
        title={slug === 'revendedoras' ? 'Seja uma revendedora' : slug}
        action={
          <>
            <span className="font-mono text-eyebrow text-ink-60">
              mabruk.com.br/{slug}
            </span>
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
            <Button variant="primary" size="md">Publicar</Button>
          </>
        }
      />

      <div className="grid gap-4 p-6 lg:grid-cols-[280px_1fr_320px]">
        {/* LEFT — Block tree */}
        <div className="flex flex-col gap-4">
          <Card
            title="Estrutura da página"
            action={
              <button type="button" className="text-ink-60 hover:text-ink">
                <Icon name="plus" size={14} />
              </button>
            }
            bodyClassName="!p-5"
          >
            <div className="flex flex-col gap-1">
              {BLOCKS.map((b, i) => (
                <button
                  key={b.type}
                  type="button"
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-2.5 border-l-2 px-3 py-2.5 text-left ${
                    selected === i
                      ? 'border-champagne bg-ink text-paper'
                      : 'border-transparent text-ink-80 hover:bg-cream'
                  }`}
                >
                  <Icon
                    name="menu"
                    size={12}
                    className={selected === i ? 'text-paper/50' : 'text-ink-40'}
                  />
                  <Icon name={b.icon} size={14} />
                  <div className="min-w-0 flex-1">
                    <div className="text-body-sm font-medium">{b.label}</div>
                    <div className="mt-0.5 truncate text-[10px] opacity-60">
                      {b.preview}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-1.5 border border-dashed border-ink-20 bg-cream px-3 py-2.5 text-eyebrow uppercase tracking-eyebrow-lg text-ink-60"
            >
              <Icon name="plus" size={12} />
              Adicionar bloco
            </button>
          </Card>

          <Card title="Configurações da página" bodyClassName="!p-5">
            <div className="flex flex-col gap-3.5">
              <LabeledField label="Título da página">
                <input defaultValue="Seja uma revendedora" />
              </LabeledField>
              <LabeledField label="Slug">
                <input className="font-mono" defaultValue={`/${slug}`} />
              </LabeledField>
              <LabeledField label="Template">
                <select defaultValue="landing">
                  <option value="landing">Landing focada em conversão</option>
                  <option value="story">Editorial / storytelling</option>
                  <option value="catalog">Catálogo</option>
                </select>
              </LabeledField>
            </div>
          </Card>
        </div>

        {/* CENTER — Preview */}
        <div className="flex flex-col border border-line bg-cream">
          <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-2.5 text-eyebrow text-ink-60">
            <span className="font-mono">mabruk.com.br/{slug}</span>
            <span className="uppercase tracking-eyebrow-lg">Pré-visualização</span>
          </div>
          <div className="flex flex-col gap-2 overflow-auto p-6">
            {BLOCKS.map((b, i) => (
              <button
                key={b.type}
                type="button"
                onClick={() => setSelected(i)}
                className={`border bg-paper p-6 text-left transition-colors ${
                  selected === i ? 'border-ink ring-2 ring-ink/10' : 'border-line'
                }`}
              >
                <div className="text-eyebrow uppercase tracking-eyebrow text-ink-60">
                  {b.label}
                </div>
                <div className="mt-2 font-display text-h6 font-normal">
                  {b.preview}
                </div>
                <div className="mt-3 h-20 bg-cream" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Block props */}
        <div className="flex flex-col gap-4">
          <Card title={`Bloco · ${block.label}`} bodyClassName="!p-5">
            <div className="flex flex-col gap-3.5">
              {block.type === 'hero' && (
                <>
                  <LabeledField label="Eyebrow">
                    <input defaultValue="Mabruk para você" />
                  </LabeledField>
                  <LabeledField label="Título">
                    <textarea rows={2} defaultValue="Seja uma revendedora" />
                  </LabeledField>
                  <LabeledField label="Subtítulo">
                    <textarea
                      rows={3}
                      defaultValue="Comece sem investimento inicial."
                    />
                  </LabeledField>
                  <LabeledField label="CTA">
                    <input defaultValue="Quero ser revendedora" />
                  </LabeledField>
                </>
              )}
              {block.type !== 'hero' && (
                <>
                  <LabeledField label="Título da seção">
                    <input defaultValue={block.preview} />
                  </LabeledField>
                  <LabeledField label="Descrição">
                    <textarea rows={3} />
                  </LabeledField>
                  <Button variant="secondary" size="sm" fullWidth>
                    Editar itens deste bloco
                  </Button>
                </>
              )}
              <div className="flex gap-2 border-t border-line pt-3">
                <Button variant="ghost" size="sm" icon={<Icon name="trash" size={12} />}>
                  Remover
                </Button>
                <Button variant="ghost" size="sm" icon={<Icon name="plus" size={12} />}>
                  Duplicar
                </Button>
              </div>
            </div>
          </Card>

          <Card title="SEO da página" bodyClassName="!p-5">
            <div className="flex flex-col gap-3.5">
              <LabeledField label="Meta título">
                <input defaultValue="Seja uma revendedora · Mabruk Semijoias" />
              </LabeledField>
              <LabeledField label="Meta descrição">
                <textarea
                  rows={3}
                  defaultValue="Programa de revendedoras Mabruk Semijoias. Comece sem investimento inicial e fature com peças desejadas."
                />
              </LabeledField>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
