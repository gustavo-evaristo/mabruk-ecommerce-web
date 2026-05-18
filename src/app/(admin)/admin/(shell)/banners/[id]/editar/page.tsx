'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ADMIN_BANNERS } from '@/lib/mock/admin';

type Device = 'desktop' | 'tablet' | 'mobile';
type Placement = 'hero' | 'editorial' | 'topbar' | 'category';

const PLACEMENTS: { id: Placement; label: string; desc: string }[] = [
  { id: 'hero', label: 'Home · Hero principal', desc: 'Tela cheia, topo da página' },
  { id: 'editorial', label: 'Home · Bloco editorial', desc: 'Após "Novidades"' },
  { id: 'topbar', label: 'Topbar promocional', desc: 'Linha preta no topo do site' },
  { id: 'category', label: 'Topo de categoria', desc: 'Acima do grid' },
];

const AUDIENCES = [
  { id: 'all', label: 'Todos os visitantes' },
  { id: 'new', label: 'Visitantes novos' },
  { id: 'insider', label: 'Clientes Insider' },
  { id: 'abandoned', label: 'Carrinho abandonado' },
];

interface Props {
  params: Promise<{ id: string }>;
}

export default function BannerEditPage({ params }: Props) {
  const { id } = use(params);
  const [active, setActive] = useState(true);
  const [placement, setPlacement] = useState<Placement>('hero');
  const [device, setDevice] = useState<Device>('desktop');

  const banner = ADMIN_BANNERS.find((b) => b.id === id) ?? ADMIN_BANNERS[0];

  const previewAspect =
    device === 'mobile' ? 'aspect-[9/16] max-w-[220px]' : 'aspect-[21/9]';

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/banners' as Route} className="hover:text-ink">
              Banners
            </Link>
            <Icon name="chevronRight" size={10} />
            <span className="text-ink">Editar</span>
          </span>
        }
        title={banner.name}
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
              {active ? 'Ativo' : 'Pausado'}
            </label>
            <Link href={'/admin/banners' as Route}>
              <Button variant="secondary" size="md">Cancelar</Button>
            </Link>
            <Button variant="primary" size="md">Publicar</Button>
          </>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_340px] lg:p-10">
        <div className="flex flex-col gap-4">
          <div className="border border-line bg-paper">
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <div className="text-eyebrow font-medium uppercase tracking-eyebrow-lg">
                Pré-visualização ao vivo
              </div>
              <div className="flex gap-1 bg-cream p-1">
                {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDevice(d)}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-eyebrow-lg ${
                      device === d ? 'bg-paper font-medium' : ''
                    }`}
                  >
                    {d === 'desktop' ? 'Desktop' : d === 'tablet' ? 'Tablet' : 'Mobile'}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-cream p-4">
              <div
                className={`relative mx-auto overflow-hidden bg-paper ${previewAspect}`}
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.name}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center p-6 lg:p-12">
                  <div
                    className={`uppercase text-ink-60 ${
                      device === 'mobile'
                        ? 'text-[8px] tracking-[0.28em]'
                        : 'text-eyebrow tracking-eyebrow-xl'
                    }`}
                  >
                    Coleção Outono · Inverno
                  </div>
                  <div
                    className={`mt-2 max-w-[60%] font-display leading-tight ${
                      device === 'mobile' ? 'text-[22px]' : 'text-display-sm'
                    }`}
                  >
                    O brilho que <em className="em-italic">permanece</em>
                  </div>
                  <button
                    type="button"
                    className={`mt-3 self-start bg-ink text-paper uppercase tracking-eyebrow ${
                      device === 'mobile'
                        ? 'px-3 py-1.5 text-[8px]'
                        : 'px-6 py-3 text-eyebrow'
                    }`}
                  >
                    Comprar agora
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Card title="Conteúdo">
            <div className="flex flex-col gap-4">
              <LabeledField label="Nome interno (não aparece no site)">
                <input defaultValue={banner.name} />
              </LabeledField>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <LabeledField label="Eyebrow">
                  <input defaultValue="Coleção Outono · Inverno" />
                </LabeledField>
                <LabeledField label="Estilo do título">
                  <select defaultValue="serif-large">
                    <option value="serif-large">Serif grande (display)</option>
                    <option value="serif-italic">Serif itálico</option>
                    <option value="sans-bold">Sans bold</option>
                  </select>
                </LabeledField>
              </div>
              <LabeledField label="Título principal">
                <textarea rows={2} defaultValue="O brilho que permanece" />
              </LabeledField>
              <LabeledField label="Subtítulo">
                <textarea
                  rows={2}
                  defaultValue="Semijoias com banho de ouro 18k e prata 925, desenhadas para acompanhar as histórias que importam."
                />
              </LabeledField>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <LabeledField label="CTA principal">
                  <input defaultValue="Comprar agora" />
                </LabeledField>
                <LabeledField label="Link do CTA">
                  <input className="font-mono" defaultValue="/colecao/oasis" />
                </LabeledField>
              </div>
            </div>
          </Card>

          <Card title="Imagem">
            <div className="text-eyebrow text-ink-60">
              Recomendado: 2880 × 1620 px · WebP ou JPEG · até 500 KB
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { label: 'Desktop (16:9)', aspect: 'aspect-[21/9]' },
                { label: 'Tablet (4:3)', aspect: 'aspect-[4/3]' },
                { label: 'Mobile (9:16)', aspect: 'aspect-[9/16]' },
              ].map((f) => (
                <LabeledField key={f.label} label={f.label}>
                  <div className={`relative border border-line bg-cream ${f.aspect}`}>
                    <Image
                      src={banner.imageUrl}
                      alt={banner.name}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-paper/95 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow"
                    >
                      Substituir
                    </button>
                  </div>
                </LabeledField>
              ))}
            </div>
            <div className="mt-5">
              <LabeledField label="Texto alt (acessibilidade)">
                <input defaultValue="Modelo usando o colar Lumière em ambiente natural" />
              </LabeledField>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Posicionamento">
            <LabeledField label="Onde aparece">
              <div className="flex flex-col gap-2">
                {PLACEMENTS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-start gap-2.5 border p-3 ${
                      placement === p.id ? 'border-ink bg-cream' : 'border-line'
                    }`}
                  >
                    <input
                      type="radio"
                      name="placement"
                      checked={placement === p.id}
                      onChange={() => setPlacement(p.id)}
                      className="!mt-0.5 !w-auto"
                    />
                    <div>
                      <div className="text-body-sm font-medium">{p.label}</div>
                      <div className="mt-0.5 text-eyebrow text-ink-60">{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </LabeledField>
          </Card>

          <Card title="Agendamento">
            <div className="flex flex-col gap-3.5">
              <LabeledField label="Início">
                <input type="datetime-local" defaultValue="2026-05-01T00:00" />
              </LabeledField>
              <LabeledField label="Fim" optional>
                <input type="datetime-local" />
              </LabeledField>
              <label className="flex items-center gap-2 text-body-sm text-ink-60">
                <input type="checkbox" className="!w-auto !m-0" />
                Repetir anualmente
              </label>
            </div>
          </Card>

          <Card title="Segmentação">
            <div className="flex flex-col gap-2.5 text-body-sm">
              {AUDIENCES.map((a, i) => (
                <label key={a.id} className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="audience"
                    defaultChecked={i === 0}
                    className="!w-auto !m-0"
                  />
                  {a.label}
                </label>
              ))}
            </div>
          </Card>

          <Card title="Performance">
            <div className="flex flex-col gap-3">
              {[
                ['Impressões', '161.240'],
                ['Cliques', '8.240'],
                ['CTR', '5,2%'],
                ['Conversões', '142'],
                ['Receita atribuída', 'R$ 34.280'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-body-sm">
                  <span className="text-ink-60">{k}</span>
                  <span className="font-mono font-medium">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
