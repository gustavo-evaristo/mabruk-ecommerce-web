'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ADMIN_BANNERS, ADMIN_LANDINGS } from '@/lib/mock/admin';

type Section = 'banners' | 'landings';

const STATS = [
  { label: 'Banners ativos', value: '2', sub: '1 agendado · 1 rascunho' },
  { label: 'Cliques no mês', value: '23.840', sub: '↑ 22% vs mês ant.' },
  { label: 'CTR médio', value: '5,1%', sub: 'banners + landing' },
  { label: 'Landing publicadas', value: '2', sub: '1 em rascunho' },
];

const STATUS_PILL: Record<string, string> = {
  ativo: 'bg-[rgba(61,106,78,0.1)] text-success',
  agendado: 'bg-cream text-ink',
  pausado: 'bg-[rgba(168,148,111,0.12)] text-champagne-dark',
  expirado: 'bg-cream text-ink-60',
  publicada: 'bg-[rgba(61,106,78,0.1)] text-success',
  rascunho: 'bg-[rgba(168,148,111,0.12)] text-champagne-dark',
  arquivada: 'bg-cream text-ink-60',
};

const STATUS_LABEL: Record<string, string> = {
  ativo: 'Ativo',
  agendado: 'Agendado',
  pausado: 'Pausado',
  expirado: 'Expirado',
  publicada: 'Publicada',
  rascunho: 'Rascunho',
  arquivada: 'Arquivada',
};

export default function BannersPage() {
  const [section, setSection] = useState<Section>('banners');

  return (
    <>
      <AdminPageHeader
        subtitle="Conteúdo"
        title="Banners & landing pages"
        action={
          <>
            <Button variant="secondary" size="md" icon={<Icon name="eye" size={14} />}>
              Pré-visualizar site
            </Button>
            <Link
              href={
                (section === 'banners'
                  ? '/admin/banners/bn-1/editar'
                  : '/admin/landings/revendedoras/editar') as Route
              }
            >
              <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
                {section === 'banners' ? 'Novo banner' : 'Nova landing'}
              </Button>
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border border-line bg-paper px-5 py-4.5">
              <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">
                {s.label}
              </div>
              <div className="mt-1.5 font-display text-h4 font-normal">{s.value}</div>
              <div className="mt-0.5 text-eyebrow text-ink-60">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="flex w-fit gap-1 border border-line bg-paper p-1">
          {(['banners', 'landings'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`px-6 py-2.5 text-body-sm tracking-wide ${
                section === s
                  ? 'bg-ink font-medium text-paper'
                  : 'text-ink-60 hover:text-ink'
              }`}
            >
              {s === 'banners' ? 'Banners' : 'Landing pages'}
            </button>
          ))}
        </div>

        {section === 'banners' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {ADMIN_BANNERS.map((b) => (
              <Link
                key={b.id}
                href={`/admin/banners/${b.id}/editar` as Route}
                className="liftable overflow-hidden border border-line bg-paper"
              >
                <div className="relative aspect-[21/9]">
                  <Image
                    src={b.imageUrl}
                    alt={b.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-medium uppercase tracking-eyebrow-lg ${
                        STATUS_PILL[b.status]
                      }`}
                    >
                      {STATUS_LABEL[b.status]}
                    </span>
                  </div>
                  <div className="absolute right-3 bottom-3 flex gap-1.5">
                    {(['eye', 'edit'] as const).map((name) => (
                      <span
                        key={name}
                        className="grid size-8 place-items-center bg-paper/95"
                      >
                        <Icon name={name} size={14} />
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <div className="font-display text-h6 leading-tight">{b.name}</div>
                    <div className="mt-1 text-eyebrow text-ink-60">
                      {b.placement} · {b.startsAt} – {b.endsAt ?? 'sem prazo'}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-mono text-body-md font-medium">
                      {b.clicks.toLocaleString('pt-BR')}
                    </div>
                    <div className="text-[10px] text-ink-60">
                      cliques · CTR {b.ctr}%
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {section === 'landings' && (
          <div className="border border-line bg-paper">
            <div
              className="hidden items-center gap-3 border-b border-line bg-cream px-5 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
              style={{
                gridTemplateColumns:
                  '40px 1.4fr 1.2fr 100px 100px 100px 120px 40px',
              }}
            >
              <input type="checkbox" className="!w-auto !m-0" />
              <span>Nome</span>
              <span>URL</span>
              <span className="text-right">Visitas</span>
              <span className="text-right">Leads</span>
              <span className="text-right">Conv.</span>
              <span>Status</span>
              <span />
            </div>
            {ADMIN_LANDINGS.map((l) => (
              <Link
                key={l.slug}
                href={`/admin/landings/${l.slug}/editar` as Route}
                className="grid items-center gap-3 border-b border-line px-5 py-4 text-body-sm hover:bg-cream/40"
                style={{
                  gridTemplateColumns:
                    '40px 1.4fr 1.2fr 100px 100px 100px 120px 40px',
                }}
              >
                <input
                  type="checkbox"
                  className="!w-auto !m-0"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="font-display text-[16px]">{l.name}</div>
                <span className="font-mono text-body-sm text-ink-80">
                  mabruk.com.br{l.path}
                </span>
                <span className="text-right font-mono">
                  {l.views.toLocaleString('pt-BR')}
                </span>
                <span className="text-right font-mono">—</span>
                <span
                  className={`text-right font-mono ${
                    l.conversion > 1 ? 'text-success' : 'text-ink-60'
                  }`}
                >
                  {l.conversion ? `${l.conversion}%` : '—'}
                </span>
                <span
                  className={`inline-flex self-start px-2.5 py-1 text-[10px] font-medium uppercase tracking-eyebrow-lg ${
                    STATUS_PILL[l.status]
                  }`}
                >
                  {STATUS_LABEL[l.status]}
                </span>
                <Icon name="chevronRight" size={14} className="text-ink-60" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
