'use client';

import { useState } from 'react';
import type { ProductDetails } from '@/lib/api/types';
import { Container } from '@/components/ui/container';
import { Stars } from '@/components/ui/stars';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

const MOCK_REVIEWS = [
  {
    author: 'Helena M.',
    date: 'há 2 semanas',
    rating: 5,
    title: 'Encantada com a peça',
    body: 'Chegou em uma embalagem maravilhosa. O acabamento é impecável, parece muito mais cara do que é.',
    verified: true,
  },
  {
    author: 'Camila S.',
    date: 'há 1 mês',
    rating: 5,
    title: 'Linda demais',
    body: 'Uso todos os dias, e até agora nenhum sinal de oxidação. Recomendo de olhos fechados.',
    verified: true,
  },
];

type TabKey = 'description' | 'specs' | 'care' | 'reviews';

interface Props {
  product: ProductDetails;
}

export function ProductTabs({ product }: Props) {
  const [tab, setTab] = useState<TabKey>('description');
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'description', label: 'Descrição' },
    { key: 'specs', label: 'Especificações' },
    { key: 'care', label: 'Cuidados' },
    { key: 'reviews', label: `Avaliações (${MOCK_REVIEWS.length})` },
  ];

  return (
    <section className="border-t border-line">
      <Container>
        <div className="flex gap-0 border-b border-line">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'border-b-2 px-6 py-5 text-eyebrow font-medium uppercase tracking-eyebrow transition-colors',
                t.key === tab
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-60 hover:text-ink',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Container>

      <Container className="py-12">
        {tab === 'description' && (
          <div className="max-w-[720px]">
            <h3 className="mb-4 font-display text-h3">Uma peça para o dia a dia</h3>
            <p className="text-body-md leading-loose text-ink-80">
              {product.description ??
                'Peça desenhada para acompanhar movimentos suaves. O contorno minimalista repousa naturalmente sobre a pele.'}
            </p>
          </div>
        )}

        {tab === 'specs' && (
          <div className="max-w-[720px]">
            <div className="flex flex-col">
              {[
                ['Banho', product.variants[0]?.banho.replace('_', ' ') ?? '—'],
                ['Camadas de banho', '3 micras'],
                ['Material base', 'Latão hipoalergênico'],
                ['Peso', product.weightInGrams ? `${product.weightInGrams} g` : '—'],
                ['SKU', product.variants[0]?.sku ?? product.id],
                ['Origem', 'São Paulo, Brasil'],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[200px_1fr] border-b border-line py-3.5 text-body"
                >
                  <span className="text-ink-60">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'care' && (
          <div className="max-w-[640px] text-body-md leading-loose text-ink-80">
            Para preservar o brilho da peça, evite contato com perfumes, cremes e produtos
            químicos. Guarde em embalagem individual, separada de outras joias. Limpe com pano
            macio e seco após o uso.
          </div>
        )}

        {tab === 'reviews' && (
          <div className="grid gap-16 lg:grid-cols-[320px_1fr]">
            <div>
              <div className="font-display text-[56px] leading-none">4,9</div>
              <Stars value={5} size={16} className="mt-2" />
              <div className="mt-2 text-body-xs text-ink-60">
                {MOCK_REVIEWS.length} avaliações verificadas
              </div>
              <div className="mt-6 flex flex-col gap-2">
                {[5, 4, 3, 2, 1].map((n) => (
                  <div key={n} className="flex items-center gap-2.5 text-body-xs">
                    <span className="font-mono nums w-3">{n}</span>
                    <Icon name="starFill" size={11} />
                    <div className="h-1 flex-1 bg-line">
                      <div
                        className="h-full bg-ink"
                        style={{ width: n === 5 ? '88%' : n === 4 ? '10%' : '1%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="mt-6">
                Escrever avaliação
              </Button>
            </div>
            <div className="flex flex-col gap-8">
              {MOCK_REVIEWS.map((r, i) => (
                <div
                  key={r.author}
                  className={cn('pb-8', i < MOCK_REVIEWS.length - 1 && 'border-b border-line')}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-body font-medium">{r.author}</div>
                      <div className="mt-1 text-body-xs text-ink-60">
                        {r.date}
                        {r.verified && <span className="ml-2 text-success">✓ Compra verificada</span>}
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <div className="mt-3 font-display text-lead">{r.title}</div>
                  <p className="mt-2 text-body leading-relaxed text-ink-80">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
