'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/lib/providers/cart-provider';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatMoney, installmentValue } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

type Step = 1 | 2 | 3;
type PaymentMethod = 'credit' | 'pix';

const SHIPPING_PRICE_CENTS = 2990;
const PIX_DISCOUNT = 0.1;
const MAX_INSTALLMENTS = 2;

const BANHO_LABEL: Record<string, string> = {
  OURO_18K: 'Ouro 18k',
  RODIO: 'Prata 925',
  OURO_ROSE: 'Ouro rosé',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [payment, setPayment] = useState<PaymentMethod>('credit');
  const [installments, setInstallments] = useState(2);

  const beforeDiscount = subtotalCents + SHIPPING_PRICE_CENTS;
  const discount = payment === 'pix' ? Math.round(beforeDiscount * PIX_DISCOUNT) : 0;
  const total = beforeDiscount - discount;
  const installmentVal = installmentValue(total, installments);

  function handleFinalize() {
    const orderNumber = `MAB-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
    clear();
    router.push(`/pedido/${orderNumber}?method=${payment}&total=${total}` as never);
  }

  return (
    <Container className="py-10 pb-24">
        {/* Stepper */}
        <div className="mb-12 flex items-center gap-6">
          {(['Identificação', 'Endereço & frete', 'Pagamento'] as const).map((label, i) => {
            const num = (i + 1) as Step;
            const active = step === num;
            const done = step > num;
            return (
              <div key={label} className="flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => (done ? setStep(num) : null)}
                  className="flex items-center gap-3"
                  disabled={!done && !active}
                >
                  <div
                    className={cn(
                      'grid size-7 place-items-center rounded-full border font-mono nums text-eyebrow',
                      active
                        ? 'border-ink bg-ink text-paper'
                        : done
                          ? 'border-ink text-ink'
                          : 'border-ink-20 text-ink-40',
                    )}
                  >
                    {done ? <Icon name="check" size={12} stroke={2} /> : num}
                  </div>
                  <span
                    className={cn(
                      'text-eyebrow font-medium uppercase tracking-eyebrow',
                      active ? 'text-ink' : done ? 'text-ink-80' : 'text-ink-40',
                    )}
                  >
                    {label}
                  </span>
                </button>
                {i < 2 && (
                  <span
                    className={cn('h-px w-14', step > num ? 'bg-ink' : 'bg-ink-20')}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid gap-16 lg:grid-cols-[1fr_440px]">
          {/* Main column */}
          <div className="flex flex-col gap-8">
            {step === 1 && (
              <section>
                <h2 className="font-display text-h2">Identificação</h2>
                <p className="mt-2 text-body-sm text-ink-60">
                  Já tem conta Mabruk?{' '}
                  <a className="text-ink underline" href="/entrar">
                    Entre aqui
                  </a>
                </p>
                <div className="mt-8 flex max-w-[540px] flex-col gap-4">
                  <Field label="E-mail">
                    <input type="email" placeholder="seu@email.com" />
                  </Field>
                  <Field label="Nome completo">
                    <input type="text" placeholder="Como aparece no documento" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="CPF">
                      <input type="text" placeholder="000.000.000-00" />
                    </Field>
                    <Field label="Telefone">
                      <input type="tel" placeholder="(11) 90000-0000" />
                    </Field>
                  </div>
                  <label className="mt-2 flex items-center gap-2.5 text-body-xs text-ink-60">
                    <input type="checkbox" defaultChecked className="!w-auto" />
                    Quero receber novidades e ofertas por e-mail
                  </label>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  className="mt-8"
                  iconRight={<Icon name="arrowRight" size={14} />}
                  onClick={() => setStep(2)}
                >
                  Continuar para entrega
                </Button>
              </section>
            )}

            {step > 1 && (
              <StepSummary
                label="Identificação"
                value="Helena Vasconcellos · helena@email.com.br"
                onEdit={() => setStep(1)}
              />
            )}

            {step === 2 && (
              <section>
                <h2 className="font-display text-h2">Endereço de entrega</h2>
                <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-end gap-4">
                    <Field label="CEP" className="w-44">
                      <input type="text" placeholder="00000-000" />
                    </Field>
                    <a className="pb-3.5 text-body-xs text-ink-60 underline">
                      Não sei meu CEP
                    </a>
                  </div>
                  <div className="grid grid-cols-[1fr_140px] gap-4">
                    <Field label="Endereço">
                      <input type="text" placeholder="Rua, avenida, alameda…" />
                    </Field>
                    <Field label="Número">
                      <input type="text" placeholder="123" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Complemento (opcional)">
                      <input type="text" placeholder="Apto, bloco, sala" />
                    </Field>
                    <Field label="Bairro">
                      <input type="text" placeholder="Bairro" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[1fr_140px] gap-4">
                    <Field label="Cidade">
                      <input type="text" placeholder="Cidade" />
                    </Field>
                    <Field label="UF">
                      <input type="text" placeholder="SP" />
                    </Field>
                  </div>
                </div>

                <h3 className="mt-12 mb-4 font-display text-h4">Forma de envio</h3>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'pac', name: 'PAC', days: '6 a 9 dias úteis', priceCents: 1890 },
                    { id: 'sedex', name: 'SEDEX', days: '2 a 4 dias úteis', priceCents: 2990, default: true },
                    { id: 'expressa', name: 'Entrega Expressa', days: '1 dia útil · São Paulo', priceCents: 4990 },
                    { id: 'pickup', name: 'Retirar na loja', days: 'Pronto em 2h · Oscar Freire', priceCents: 0 },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-4 border px-4 py-3.5',
                        s.default ? 'border-ink bg-cream' : 'border-line',
                      )}
                    >
                      <input type="radio" name="ship" defaultChecked={s.default} className="!w-auto" />
                      <span className="flex-1">
                        <div className="text-body font-medium">{s.name}</div>
                        <div className="mt-0.5 text-body-xs text-ink-60">{s.days}</div>
                      </span>
                      <span className="font-mono nums text-body-md">
                        {s.priceCents === 0 ? 'Grátis' : formatMoney(s.priceCents)}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-8 flex gap-3">
                  <Button variant="secondary" icon={<Icon name="arrowLeft" size={12} />} onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1"
                    iconRight={<Icon name="arrowRight" size={14} />}
                    onClick={() => setStep(3)}
                  >
                    Continuar para pagamento
                  </Button>
                </div>
              </section>
            )}

            {step > 2 && (
              <StepSummary
                label="Endereço & frete"
                value="R. Bela Cintra, 1024 · apto 82 · Jardins, São Paulo, SP"
                sub="SEDEX · 2 a 4 dias úteis · R$ 29,90"
                onEdit={() => setStep(2)}
              />
            )}

            {step === 3 && (
              <section>
                <h2 className="font-display text-h2">Pagamento</h2>
                <div className="mt-8 flex flex-col gap-4">
                  {/* Cartão */}
                  <div className={cn('border', payment === 'credit' ? 'border-ink' : 'border-line')}>
                    <label className="flex cursor-pointer items-center gap-3.5 px-5 py-4">
                      <input
                        type="radio"
                        checked={payment === 'credit'}
                        onChange={() => setPayment('credit')}
                        className="!w-auto"
                      />
                      <Icon name="creditCard" size={20} />
                      <span className="flex-1 text-body font-medium">Cartão de crédito</span>
                      <span className="text-body-xs text-ink-60">Até 2x sem juros</span>
                    </label>
                    {payment === 'credit' && (
                      <div className="flex flex-col gap-4 border-t border-line px-5 py-5">
                        <Field label="Número do cartão">
                          <input type="text" placeholder="0000 0000 0000 0000" />
                        </Field>
                        <Field label="Nome impresso no cartão">
                          <input type="text" placeholder="Como aparece no cartão" />
                        </Field>
                        <div className="grid grid-cols-3 gap-4">
                          <Field label="Validade">
                            <input type="text" placeholder="MM/AA" />
                          </Field>
                          <Field label="CVV">
                            <input type="text" placeholder="000" />
                          </Field>
                          <Field label="Parcelas">
                            <select
                              value={installments}
                              onChange={(e) => setInstallments(Number(e.target.value))}
                            >
                              {Array.from({ length: MAX_INSTALLMENTS }).map((_, idx) => {
                                const n = idx + 1;
                                return (
                                  <option key={n} value={n}>
                                    {n}x de {formatMoney(installmentValue(total, n))} sem juros
                                  </option>
                                );
                              })}
                            </select>
                          </Field>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PIX */}
                  <div className={cn('relative border', payment === 'pix' ? 'border-ink' : 'border-line')}>
                    <span className="absolute -top-2.5 right-4 bg-success px-2.5 py-1 text-[9px] font-medium uppercase tracking-eyebrow-lg text-paper">
                      10% off
                    </span>
                    <label className="flex cursor-pointer items-center gap-3.5 px-5 py-4">
                      <input
                        type="radio"
                        checked={payment === 'pix'}
                        onChange={() => setPayment('pix')}
                        className="!w-auto"
                      />
                      <Icon name="pix" size={20} />
                      <span className="flex-1 text-body font-medium">PIX</span>
                      <span className="text-body-xs text-ink-60">À vista · aprovação imediata</span>
                    </label>
                    {payment === 'pix' && (
                      <div className="border-t border-line px-5 py-4 text-body-xs leading-relaxed text-ink-60">
                        Após finalizar, você receberá um QR Code e código PIX copia-e-cola.
                        O pagamento expira em 30 minutos.
                      </div>
                    )}
                  </div>
                </div>

                <label className="mt-8 flex items-start gap-2.5 text-body-xs leading-relaxed text-ink-60">
                  <input type="checkbox" defaultChecked className="!w-auto mt-1" />
                  Li e aceito os{' '}
                  <a className="text-ink underline">Termos de Compra</a> e a{' '}
                  <a className="text-ink underline">Política de Privacidade</a>
                </label>

                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" icon={<Icon name="arrowLeft" size={12} />} onClick={() => setStep(2)}>
                    Voltar
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    icon={<Icon name="lock" size={14} />}
                    onClick={handleFinalize}
                    disabled={items.length === 0}
                  >
                    Pagar {formatMoney(total)}
                  </Button>
                </div>
              </section>
            )}
          </div>

          {/* Summary */}
          <aside>
            <div className="sticky top-6 flex flex-col gap-4 bg-cream p-8">
              <h3 className="font-display text-h5">Seu pedido</h3>
              <div className="flex max-h-[280px] flex-col gap-3.5 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.itemId}
                    className="grid grid-cols-[56px_1fr_auto] items-center gap-3"
                  >
                    <div className="relative h-16 w-14 bg-paper">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                      <span className="font-mono nums absolute -top-1.5 -right-1.5 grid size-[18px] place-items-center rounded-full bg-ink text-[9px] text-paper">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-body-xl leading-tight">{item.productName}</div>
                      <div className="text-body-xs text-ink-60">
                        {BANHO_LABEL[item.banho] ?? item.banho} · {item.size}
                      </div>
                    </div>
                    <div className="font-mono nums text-body-sm">
                      {formatMoney(item.unitPriceCents * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px bg-ink/10" />
              <div className="flex flex-col gap-2 text-body-sm">
                <Row label="Subtotal" value={formatMoney(subtotalCents)} />
                <Row label="Frete (SEDEX)" value={formatMoney(SHIPPING_PRICE_CENTS)} />
                {discount > 0 && (
                  <Row
                    label="Desconto PIX (10%)"
                    value={`- ${formatMoney(discount)}`}
                    className="text-success"
                  />
                )}
              </div>
              <div className="h-px bg-ink/10" />
              <div className="flex items-baseline justify-between">
                <span className="text-body-md font-medium">Total</span>
                <div className="text-right">
                  <div className="font-display text-h3">{formatMoney(total)}</div>
                  {payment === 'credit' && (
                    <div className="text-body-xs text-ink-60">
                      em <span className="font-mono nums">{installments}x</span> de{' '}
                      <span className="font-mono nums">{formatMoney(installmentVal)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-2 text-body-xs text-ink-60">
                <div className="flex items-center gap-2">
                  <Icon name="lock" size={12} /> Compra 100% segura
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="pkg" size={12} /> Embalagem presente inclusa
                </div>
              </div>
            </div>
          </aside>
        </div>
    </Container>
  );
}

function StepSummary({
  label,
  value,
  sub,
  onEdit,
}: {
  label: string;
  value: string;
  sub?: string;
  onEdit: () => void;
}) {
  return (
    <section className="flex items-start justify-between border border-line p-5">
      <div>
        <div className="eyebrow">{label}</div>
        <div className="mt-1.5 text-body-md">{value}</div>
        {sub && <div className="mt-1 text-body-xs text-ink-60">{sub}</div>}
      </div>
      <button type="button" onClick={onEdit} className="text-body-sm text-ink underline">
        Alterar
      </button>
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn('flex justify-between', className)}>
      <span className="text-ink-60">{label}</span>
      <span className="font-mono nums">{value}</span>
    </div>
  );
}
