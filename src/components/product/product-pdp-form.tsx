'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProductDetails, ProductVariant } from '@/lib/api/types';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { QtyStepper } from '@/components/ui/qty-stepper';
import { Stars } from '@/components/ui/stars';
import { Tag } from '@/components/ui/tag';
import { formatMoney } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { useCart } from '@/lib/providers/cart-provider';
import { InstallmentText } from '@/components/ui/installment-text';

interface Props {
  product: ProductDetails;
  /** Callback opcional pra notificar a página da PDP qual variante está selecionada (usado pra trocar galeria). */
  onVariantChange?: (variantId: string | null) => void;
}

/** Quais variantes têm um valueSlug pra um attrSlug específico (memoizado por convenção). */
function variantHasValue(v: ProductVariant, attrSlug: string, valueSlug: string): boolean {
  return v.attributeValues.some(
    (av) => av.attributeSlug === attrSlug && av.valueSlug === valueSlug,
  );
}

export function ProductPdpForm({ product, onVariantChange }: Props) {
  const cart = useCart();
  const isSimple = product.type === 'SIMPLE';

  // Para produto SIMPLE: a única variante é a default; selecionada automaticamente.
  const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0];

  // Mapa de slug do atributo → slug do valor selecionado
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    if (isSimple) return {};
    // tenta pré-selecionar o primeiro valor de cada atributo que tenha pelo menos uma variante com estoque
    const init: Record<string, string> = {};
    for (const attr of product.attributes) {
      const firstWithStock = attr.values.find((val) =>
        product.variants.some(
          (v) => v.isActive && v.stock > 0 && variantHasValue(v, attr.slug, val.slug),
        ),
      );
      const first = firstWithStock ?? attr.values[0];
      if (first) init[attr.slug] = first.slug;
    }
    return init;
  });

  const selectedVariant = useMemo<ProductVariant | undefined>(() => {
    if (isSimple) return defaultVariant;
    if (product.attributes.length === 0) return undefined;
    return product.variants.find((v) =>
      product.attributes.every(
        (attr) => selected[attr.slug] && variantHasValue(v, attr.slug, selected[attr.slug]),
      ),
    );
  }, [isSimple, defaultVariant, product.attributes, product.variants, selected]);

  // Notifica parent pra trocar a galeria
  useEffect(() => {
    onVariantChange?.(selectedVariant?.id ?? null);
  }, [selectedVariant, onVariantChange]);

  const priceCents = selectedVariant?.priceCents ?? product.priceFromCents;
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState('');
  const [shipping, setShipping] = useState<
    { name: string; days: string; priceCents: number }[] | null
  >(null);

  function handleCalcFrete() {
    if (cep.replace(/\D/g, '').length === 8) {
      setShipping([
        { name: 'PAC', days: '6 a 9 dias úteis', priceCents: 1890 },
        { name: 'SEDEX', days: '2 a 4 dias úteis', priceCents: 2990 },
      ]);
    }
  }

  async function handleAddToCart() {
    if (!selectedVariant) return;
    await cart.addItem({ variantId: selectedVariant.id, quantity: qty });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="eyebrow">{product.tags?.[0]?.name ?? product.category.name}</div>
        <h1 className="mt-2 font-display text-[42px] leading-tight">{product.name}</h1>
        <div className="mt-3 flex items-center gap-3">
          <Stars value={5} count={47} />
          <span className="text-ink-60">·</span>
          <span className="font-mono nums text-body-xs text-ink-60">
            {selectedVariant?.sku ?? product.id}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 border-b border-line pb-5">
        <div className="font-display text-h3">{formatMoney(priceCents)}</div>
        <div className="text-body-sm text-ink-60">
          <InstallmentText priceCents={priceCents} />
        </div>
      </div>

      {/* Atributos dinâmicos (só pra VARIABLE) */}
      {!isSimple &&
        product.attributes.map((attr) => {
          const selectedSlug = selected[attr.slug];
          return (
            <div key={attr.id}>
              <div className="mb-2.5 flex items-baseline justify-between">
                <span className="text-eyebrow font-medium uppercase tracking-eyebrow">
                  {attr.name}
                </span>
                {selectedSlug && (
                  <span className="text-body-xs text-ink-60">
                    {attr.values.find((v) => v.slug === selectedSlug)?.name}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {attr.values.map((val) => {
                  const isSel = selectedSlug === val.slug;
                  // checa se existe alguma variante combinando esse valor + resto da seleção atual
                  const hasMatch = product.variants.some((v) => {
                    if (!variantHasValue(v, attr.slug, val.slug)) return false;
                    // valida demais atributos contra seleção atual
                    return product.attributes.every((other) => {
                      if (other.slug === attr.slug) return true;
                      const sel = selected[other.slug];
                      if (!sel) return true;
                      return variantHasValue(v, other.slug, sel);
                    });
                  });
                  const disabled = !hasMatch;
                  if (attr.type === 'COLOR') {
                    return (
                      <button
                        key={val.id}
                        type="button"
                        onClick={() =>
                          !disabled &&
                          setSelected((s) => ({ ...s, [attr.slug]: val.slug }))
                        }
                        disabled={disabled}
                        aria-label={val.name}
                        title={val.name}
                        className={cn(
                          'grid size-9 place-items-center rounded-full border-2',
                          isSel ? 'border-ink' : 'border-line hover:border-ink-60',
                          disabled && 'cursor-not-allowed opacity-40',
                        )}
                      >
                        <span
                          className="size-7 rounded-full"
                          style={{ background: val.hex ?? '#ccc' }}
                        />
                      </button>
                    );
                  }
                  return (
                    <button
                      key={val.id}
                      type="button"
                      onClick={() =>
                        !disabled &&
                        setSelected((s) => ({ ...s, [attr.slug]: val.slug }))
                      }
                      disabled={disabled}
                      className={cn(
                        'grid h-10 min-w-[60px] place-items-center border px-3 text-body',
                        isSel
                          ? 'border-ink bg-ink text-paper'
                          : 'border-line text-ink hover:border-ink',
                        disabled && 'cursor-not-allowed line-through opacity-40',
                      )}
                    >
                      {val.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Qty + CTA */}
      <div className="mt-2 flex gap-3">
        <QtyStepper value={qty} onChange={setQty} max={selectedVariant?.stock ?? 1} />
        <Button
          variant="primary"
          fullWidth
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock === 0}
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
          {selectedVariant?.stock ? 'Em estoque · envio em até 24h' : 'Sem estoque no momento'}
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

      {!product.inStock && (
        <Tag variant="line" className="self-start">
          Esgotado
        </Tag>
      )}
    </div>
  );
}
