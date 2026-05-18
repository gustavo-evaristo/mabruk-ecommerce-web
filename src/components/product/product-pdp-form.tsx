'use client';

import { useMemo, useState } from 'react';
import type { ProductDetails, ProductVariant, Banho } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { QtyStepper } from '@/components/ui/qty-stepper';
import { Stars } from '@/components/ui/stars';
import { Tag } from '@/components/ui/tag';
import { formatMoney } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/lib/providers/cart-provider';
import { InstallmentText } from '@/components/ui/installment-text';

const BANHO_INFO: Record<Banho, { label: string; color: string }> = {
  OURO_18K: { label: 'Ouro 18k', color: '#D9C9A8' },
  PRATA_925: { label: 'Prata 925', color: '#D8D5CE' },
  ACO_INOX: { label: 'Aço inoxidável', color: '#B8BCC2' },
};

interface Props {
  product: ProductDetails;
}

export function ProductPdpForm({ product }: Props) {
  const cart = useCart();
  const banhosAvailable = useMemo(
    () =>
      Array.from(new Set(product.variants.map((v) => v.banho))).filter(
        (b): b is Banho => b in BANHO_INFO,
      ),
    [product.variants],
  );
  const [banho, setBanho] = useState<Banho>(banhosAvailable[0]);
  const sizesForBanho = useMemo(
    () => product.variants.filter((v) => v.banho === banho),
    [banho, product.variants],
  );
  const [size, setSize] = useState<string>(sizesForBanho[0]?.size ?? '');
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState('');
  const [shipping, setShipping] = useState<
    { name: string; days: string; priceCents: number }[] | null
  >(null);

  // Garante size válido quando banho muda
  useMemo(() => {
    if (!sizesForBanho.some((v) => v.size === size)) {
      setSize(sizesForBanho[0]?.size ?? '');
    }
  }, [sizesForBanho, size]);

  const selected: ProductVariant | undefined = sizesForBanho.find((v) => v.size === size);
  const priceCents = selected?.priceCents ?? product.priceFromCents;

  function handleCalcFrete() {
    if (cep.replace(/\D/g, '').length === 8) {
      setShipping([
        { name: 'PAC', days: '6 a 9 dias úteis', priceCents: 1890 },
        { name: 'SEDEX', days: '2 a 4 dias úteis', priceCents: 2990 },
      ]);
    }
  }

  async function handleAddToCart() {
    if (!selected) return;
    await cart.addItem({
      variantId: selected.id,
      quantity: qty,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="eyebrow">{product.tags?.[0]?.name ?? product.category.name}</div>
        <h1 className="mt-2 font-display text-[42px] leading-tight">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <Stars value={5} count={47} />
          <span className="text-ink-60">·</span>
          <span className="font-mono nums text-body-xs text-ink-60">{selected?.sku ?? product.id}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-b border-line pb-5">
        <div className="font-display text-h3">{formatMoney(priceCents)}</div>
        <div className="text-body-sm text-ink-60">
          <InstallmentText priceCents={priceCents} />
        </div>
      </div>

      {/* Banho */}
      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-eyebrow font-medium uppercase tracking-eyebrow">Banho</span>
          <span className="text-body-xs text-ink-60">{BANHO_INFO[banho].label}</span>
        </div>
        <div className="flex gap-2">
          {banhosAvailable.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBanho(b)}
              aria-label={BANHO_INFO[b].label}
              className={cn(
                'border p-1',
                banho === b ? 'border-ink' : 'border-line',
              )}
            >
              <span
                className="block size-7 rounded-full"
                style={{ background: BANHO_INFO[b].color }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Tamanho */}
      <div>
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-eyebrow font-medium uppercase tracking-eyebrow">Tamanho</span>
          <button type="button" className="text-body-xs text-ink-60 underline">
            Tabela de tamanhos
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizesForBanho.map((v) => {
            const isSel = v.size === size;
            const disabled = v.stock === 0;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => !disabled && setSize(v.size)}
                disabled={disabled}
                className={cn(
                  'font-mono nums grid h-10 min-w-[46px] place-items-center border px-2 text-body',
                  isSel
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line text-ink hover:border-ink',
                  disabled && 'cursor-not-allowed line-through opacity-40',
                )}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Qty + CTA */}
      <div className="mt-2 flex gap-3">
        <QtyStepper value={qty} onChange={setQty} max={selected?.stock ?? 1} />
        <Button
          variant="primary"
          fullWidth
          onClick={handleAddToCart}
          disabled={!selected || selected.stock === 0}
        >
          Adicionar à sacola
        </Button>
      </div>
      <Button variant="secondary" fullWidth icon={<Icon name="heart" size={14} />}>
        Adicionar aos favoritos
      </Button>

      {/* Frete */}
      <div className="flex flex-col gap-3 bg-cream p-4">
        <div className="flex items-center gap-2.5">
          <Icon name="truck" size={18} />
          <span className="text-eyebrow font-medium uppercase tracking-eyebrow">
            Calcular frete e prazo
          </span>
        </div>
        <div className="flex gap-2">
          <input
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="00000-000"
            className="!bg-paper"
          />
          <Button size="sm" variant="primary" onClick={handleCalcFrete} className="!h-10">
            OK
          </Button>
        </div>
        {shipping && (
          <div className="flex flex-col gap-1.5 pt-1">
            {shipping.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between border-b border-ink/5 py-2 text-body-sm last:border-b-0"
              >
                <span className="font-medium">{s.name}</span>
                <span className="text-ink-60">{s.days}</span>
                <span className="font-mono nums">{formatMoney(s.priceCents)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust */}
      <div className="flex flex-col gap-2.5 text-body-sm text-ink-60">
        <div className="flex items-center gap-2.5">
          <Icon name="check" size={14} />
          {selected?.stock ? 'Em estoque · envio em até 24h' : 'Sem estoque no momento'}
        </div>
        <div className="flex items-center gap-2.5">
          <Icon name="pkg" size={14} />
          Embalagem presente Mabruk inclusa
        </div>
        <div className="flex items-center gap-2.5">
          <Icon name="lock" size={14} />
          Compra protegida · 7 dias para arrependimento
        </div>
      </div>

      {/* Badges visuais para feedback de novidades / esgotado */}
      {!product.inStock && (
        <Tag variant="line" className="self-start">
          Esgotado
        </Tag>
      )}
    </div>
  );
}
