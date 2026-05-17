'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Route } from 'next';
import { useCart } from '@/lib/providers/cart-provider';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { QtyStepper } from '@/components/ui/qty-stepper';
import { formatMoney, installmentValue } from '@/lib/utils/format';

const BANHO_LABEL: Record<string, string> = {
  OURO_18K: 'Ouro 18k',
  PRATA_925: 'Prata 925',
  ACO_INOX: 'Aço inoxidável',
};

const FREE_SHIPPING_THRESHOLD = 30000;
const INSTALLMENTS = 6;

export default function CartPage() {
  const { items, subtotalCents, totalItems, updateQuantity, removeItem } = useCart();
  const [cep, setCep] = useState('');
  const [shippingChoice, setShippingChoice] = useState<'pac' | 'sedex' | 'expressa'>('sedex');

  const shippingPrice =
    shippingChoice === 'pac' ? 1890 : shippingChoice === 'sedex' ? 2990 : 4990;
  const grandTotal = subtotalCents + (items.length > 0 ? shippingPrice : 0);
  const installment = installmentValue(grandTotal, INSTALLMENTS);
  const progress = Math.min(100, (subtotalCents / FREE_SHIPPING_THRESHOLD) * 100);
  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalCents);

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-center gap-6 py-24 text-center">
        <Icon name="bag" size={48} className="text-ink-40" />
        <h1 className="font-display text-h2">Sua sacola está vazia</h1>
        <p className="max-w-md text-body-md text-ink-60">
          Vamos compor a sua próxima joia? Comece pelas categorias ou pelas coleções.
        </p>
        <Link href="/aneis">
          <Button variant="primary" iconRight={<Icon name="arrowRight" size={14} />}>
            Explorar peças
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-8 pb-16 lg:py-12 lg:pb-24">
      <div className="mb-6 flex items-end justify-between lg:mb-8">
        <div>
          <div className="eyebrow">Etapa 1 de 3</div>
          <h1 className="mt-2 font-display text-h2 lg:text-h1">Sua sacola</h1>
        </div>
        <div className="font-mono nums text-body-sm text-ink-60">
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </div>
      </div>

      <div className="mb-10 flex flex-col gap-3 bg-cream p-5">
        <div className="flex items-center justify-between text-body-sm">
          <span className="inline-flex items-center gap-2">
            <Icon name="truck" size={16} />
            {missing > 0 ? (
              <>
                Faltam{' '}
                <strong className="font-mono nums">{formatMoney(missing)}</strong> para
                frete grátis
              </>
            ) : (
              <span className="font-medium text-success">Você ganhou frete grátis!</span>
            )}
          </span>
          <span className="font-mono nums text-body-xs text-ink-60">
            {formatMoney(subtotalCents)} / {formatMoney(FREE_SHIPPING_THRESHOLD)}
          </span>
        </div>
        <div className="h-[3px] bg-ink/10">
          <div className="h-full bg-ink transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid gap-10 lg:gap-16 lg:grid-cols-[1fr_440px]">
        {/* Itens */}
        <div>
          {/* Header só em desktop */}
          <div className="hidden grid-cols-[100px_1fr_140px_100px_40px] gap-4 border-b border-ink-20 pb-3 text-eyebrow-sm font-medium uppercase tracking-eyebrow text-ink-60 lg:grid">
            <span>Produto</span>
            <span />
            <span className="text-center">Quantidade</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          {items.map((item) => (
            <div
              key={item.itemId}
              className="grid grid-cols-[80px_1fr_auto] items-start gap-4 border-b border-line py-5 lg:grid-cols-[100px_1fr_140px_100px_40px] lg:items-center lg:py-7"
            >
              <div className="relative h-[96px] w-20 bg-cream lg:h-[120px] lg:w-[100px]">
                {item.imageUrl && (
                  <Image src={item.imageUrl} alt={item.productName} fill sizes="100px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/produto/${item.productSlug}` as Route}
                  className="font-display text-body-xl leading-tight hover:underline lg:text-h6"
                >
                  {item.productName}
                </Link>
                <div className="text-body-xs text-ink-60">
                  {BANHO_LABEL[item.banho] ?? item.banho} · {item.size}
                </div>
                <div className="mt-1 font-mono nums text-body">{formatMoney(item.unitPriceCents)}</div>
                <div className="mt-2 flex items-center gap-3 lg:hidden">
                  <QtyStepper value={item.quantity} onChange={(q) => updateQuantity(item.itemId, q)} />
                  <span className="font-mono nums text-body-md">
                    {formatMoney(item.unitPriceCents * item.quantity)}
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-1 self-start text-body-xs text-ink-60 underline hover:text-ink"
                >
                  Mover para favoritos
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.itemId)}
                aria-label="Remover"
                className="text-ink-60 hover:text-ink lg:hidden"
              >
                <Icon name="close" size={16} />
              </button>
              {/* Colunas desktop apenas */}
              <div className="hidden lg:flex lg:justify-center">
                <QtyStepper value={item.quantity} onChange={(q) => updateQuantity(item.itemId, q)} />
              </div>
              <div className="hidden text-right font-mono nums text-body-xl lg:block">
                {formatMoney(item.unitPriceCents * item.quantity)}
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.itemId)}
                aria-label="Remover"
                className="hidden justify-self-end text-ink-60 hover:text-ink lg:block"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          ))}

          <div className="mt-8">
            <Link href="/aneis">
              <Button variant="ghost" size="sm" icon={<Icon name="arrowLeft" size={12} />}>
                Continuar comprando
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside>
          <div className="flex flex-col gap-5 bg-cream p-6 lg:sticky lg:top-24 lg:p-8">
            <h2 className="font-display text-h4">Resumo do pedido</h2>

            <div>
              <div className="mb-2 text-eyebrow font-medium uppercase tracking-eyebrow">
                CEP de entrega
              </div>
              <div className="flex gap-2">
                <input
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="!flex-1 !bg-paper"
                />
                <Button variant="secondary" size="sm" className="!h-10">
                  OK
                </Button>
              </div>
              <div className="mt-3 flex flex-col gap-1.5">
                {(
                  [
                    { id: 'pac' as const, name: 'PAC', days: '6-9 dias', priceCents: 1890 },
                    { id: 'sedex' as const, name: 'SEDEX', days: '2-4 dias', priceCents: 2990 },
                    { id: 'expressa' as const, name: 'Expressa', days: '1 dia útil', priceCents: 4990 },
                  ]
                ).map((s) => (
                  <label
                    key={s.id}
                    className={`flex cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-body-sm ${
                      shippingChoice === s.id ? 'border-ink bg-paper' : 'border-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={shippingChoice === s.id}
                      onChange={() => setShippingChoice(s.id)}
                      className="!w-auto"
                    />
                    <span className="flex-1 font-medium">{s.name}</span>
                    <span className="text-ink-60">{s.days}</span>
                    <span className="font-mono nums w-16 text-right">{formatMoney(s.priceCents)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-ink/10" />

            <div className="flex flex-col gap-2.5 text-body-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono nums">{formatMoney(subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className="font-mono nums">{formatMoney(shippingPrice)}</span>
              </div>
            </div>

            <div className="h-px bg-ink/10" />

            <div className="flex items-baseline justify-between">
              <span className="text-body-md font-medium">Total</span>
              <div className="text-right">
                <div className="font-display text-h4">{formatMoney(grandTotal)}</div>
                <div className="text-body-xs text-ink-60">
                  ou <span className="font-mono nums">{INSTALLMENTS}x</span> de{' '}
                  <span className="font-mono nums">{formatMoney(installment)}</span> sem juros
                </div>
              </div>
            </div>

            <Link href={'/checkout' as Route}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                iconRight={<Icon name="arrowRight" size={14} />}
              >
                Finalizar compra
              </Button>
            </Link>

            <div className="flex flex-col gap-2 text-body-xs text-ink-60">
              <div className="flex items-center gap-2">
                <Icon name="lock" size={12} />
                Pagamento 100% seguro · SSL
              </div>
              <div className="flex items-center gap-2">
                <Icon name="pkg" size={12} />
                Embalagem presente Mabruk inclusa
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
