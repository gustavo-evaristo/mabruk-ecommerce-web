'use client';

import { useActionState, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  saveProductAction,
  deleteProductAction,
  createVariantAction,
  deleteVariantAction,
  uploadProductImageAction,
  deleteProductImageAction,
  adjustStockAction,
  type ActionState,
} from '@/lib/auth/admin-product-actions';
import type { AdminCategory } from '@/lib/api/endpoints/admin';

const INITIAL: ActionState = {};

interface ProductForForm {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  basePriceCents: number;
  weightInGrams: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  category: { id: string };
  variants: {
    id: string;
    sku: string;
    banho: string;
    size: string;
    priceCents: number;
    stock: number;
  }[];
  images: { id: string; url: string; alt: string | null }[];
}

interface Props {
  product: ProductForForm | null;
  categories: AdminCategory[];
}

const BANHOS = [
  { value: 'OURO_18K', label: 'Ouro 18k' },
  { value: 'PRATA_925', label: 'Prata 925' },
  { value: 'ACO_INOX', label: 'Aço inoxidável' },
];

export function ProductForm({ product, categories }: Props) {
  const router = useRouter();
  const id = product?.id ?? null;
  const [state, formAction, pending] = useActionState(
    saveProductAction.bind(null, id),
    INITIAL,
  );

  if (state.ok && !id && state.id) {
    queueMicrotask(() => router.push(`/admin/produtos/${state.id}/editar`));
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm('Excluir este produto?')) return;
    await deleteProductAction(id);
    router.push('/admin/produtos');
  }

  return (
    <>
      <form action={formAction} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
        <div className="flex flex-col gap-4">
          <Card title="Informações básicas">
            <div className="flex flex-col gap-4">
              <LabeledField label="Nome do produto">
                <input
                  type="text"
                  name="name"
                  defaultValue={product?.name ?? ''}
                  required
                />
              </LabeledField>
              <LabeledField label="Slug (URL)" optional>
                <input
                  type="text"
                  name="slug"
                  defaultValue={product?.slug ?? ''}
                  className="font-mono"
                  placeholder="auto-gerado se vazio"
                />
              </LabeledField>
              <LabeledField label="Descrição">
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={product?.description ?? ''}
                />
              </LabeledField>
              <LabeledField label="Categoria">
                <select name="categoryId" required defaultValue={product?.category.id ?? ''}>
                  <option value="">— Selecione —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </LabeledField>
              <div className="grid grid-cols-2 gap-4">
                <LabeledField label="Preço base (centavos)">
                  <input
                    type="number"
                    name="basePriceCents"
                    defaultValue={product?.basePriceCents ?? 0}
                    min={0}
                    required
                    className="font-mono"
                  />
                </LabeledField>
                <LabeledField label="Peso (g)" optional>
                  <input
                    type="number"
                    name="weightInGrams"
                    defaultValue={product?.weightInGrams ?? ''}
                    min={0}
                    className="font-mono"
                  />
                </LabeledField>
              </div>
            </div>
          </Card>

          <Card title="SEO">
            <div className="flex flex-col gap-4">
              <LabeledField label="Meta título" optional>
                <input
                  type="text"
                  name="seoTitle"
                  defaultValue={product?.seoTitle ?? ''}
                />
              </LabeledField>
              <LabeledField label="Meta descrição" optional>
                <textarea
                  name="seoDescription"
                  rows={3}
                  defaultValue={product?.seoDescription ?? ''}
                />
              </LabeledField>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card title="Publicação">
            <LabeledField label="Status">
              <select name="status" defaultValue={product?.status ?? 'DRAFT'}>
                <option value="DRAFT">Rascunho</option>
                <option value="ACTIVE">Publicado</option>
                <option value="ARCHIVED">Arquivado</option>
              </select>
            </LabeledField>
          </Card>

          {state.error && (
            <div className="border border-sale bg-[rgba(140,58,46,0.08)] px-3.5 py-2.5 text-body-sm text-sale">
              {state.error}
            </div>
          )}
          {state.ok && (
            <div className="border border-success bg-[rgba(61,106,78,0.08)] px-3.5 py-2.5 text-body-sm text-success">
              Salvo.
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button type="submit" variant="primary" disabled={pending} fullWidth>
              {pending ? 'Salvando…' : id ? 'Salvar alterações' : 'Criar produto'}
            </Button>
            <Link href={'/admin/produtos' as Route}>
              <Button type="button" variant="ghost" fullWidth>
                Cancelar
              </Button>
            </Link>
            {id && (
              <Button
                type="button"
                variant="danger"
                fullWidth
                onClick={onDelete}
                icon={<Icon name="trash" size={12} />}
                className="mt-3"
              >
                Excluir produto
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Seções extras só pra produto existente */}
      {product && (
        <div className="grid gap-6 px-6 pb-10 lg:grid-cols-[1fr_320px] lg:px-10">
          <div className="flex flex-col gap-4">
            <VariantsSection product={product} />
            <ImagesSection product={product} />
          </div>
          <div />
        </div>
      )}
    </>
  );
}

function VariantsSection({ product }: { product: ProductForForm }) {
  const [state, formAction, pending] = useActionState(
    createVariantAction.bind(null, product.id),
    INITIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <Card title="Variantes (banho × tamanho)">
      <div className="mb-4 border border-line">
        <div
          className="hidden gap-3 bg-cream px-3 py-2.5 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 md:grid"
          style={{ gridTemplateColumns: '140px 100px 80px 100px 100px 40px' }}
        >
          <span>SKU</span>
          <span>Banho</span>
          <span>Tamanho</span>
          <span className="text-right">Preço</span>
          <span className="text-right">Estoque</span>
          <span />
        </div>
        {product.variants.length === 0 ? (
          <div className="px-3 py-6 text-center text-body-sm text-ink-60">
            Nenhuma variante. Adicione abaixo.
          </div>
        ) : (
          product.variants.map((v) => (
            <VariantRow key={v.id} productId={product.id} variant={v} />
          ))
        )}
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="grid items-end gap-3 md:grid-cols-[140px_120px_80px_120px_80px_auto]"
      >
        <LabeledField label="SKU">
          <input name="sku" required className="font-mono" placeholder="MAB-..." />
        </LabeledField>
        <LabeledField label="Banho">
          <select name="banho" required>
            <option value="">—</option>
            {BANHOS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </LabeledField>
        <LabeledField label="Tamanho">
          <input name="size" required placeholder="UNICO, 16, etc" />
        </LabeledField>
        <LabeledField label="Preço (cents)">
          <input
            name="priceCents"
            type="number"
            min={1}
            required
            className="font-mono"
            placeholder="14990"
          />
        </LabeledField>
        <LabeledField label="Estoque">
          <input
            name="stock"
            type="number"
            min={0}
            defaultValue={0}
            className="font-mono"
          />
        </LabeledField>
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending ? '…' : '+ Adicionar'}
        </Button>
      </form>
      {state.error && (
        <div className="mt-2 text-eyebrow text-sale">{state.error}</div>
      )}
    </Card>
  );
}

function VariantRow({
  productId,
  variant,
}: {
  productId: string;
  variant: ProductForForm['variants'][number];
}) {
  const [pending, setPending] = useState(false);

  async function remove() {
    if (!confirm('Remover variante?')) return;
    setPending(true);
    await deleteVariantAction(productId, variant.id);
    setPending(false);
  }

  async function adjust(delta: number) {
    setPending(true);
    await adjustStockAction(productId, variant.id, delta);
    setPending(false);
  }

  return (
    <div
      className="grid items-center gap-3 border-t border-line px-3 py-2.5 text-body-sm"
      style={{ gridTemplateColumns: '140px 100px 80px 100px 100px 40px' }}
    >
      <span className="font-mono text-eyebrow">{variant.sku}</span>
      <span className="text-eyebrow">{variant.banho}</span>
      <span className="font-mono">{variant.size}</span>
      <span className="text-right font-mono">
        {(variant.priceCents / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => adjust(-1)}
          disabled={pending || variant.stock === 0}
          className="grid size-6 place-items-center bg-cream text-ink-60 hover:text-ink disabled:opacity-40"
        >
          −
        </button>
        <span className="min-w-[24px] text-center font-mono">{variant.stock}</span>
        <button
          type="button"
          onClick={() => adjust(1)}
          disabled={pending}
          className="grid size-6 place-items-center bg-cream text-ink-60 hover:text-ink disabled:opacity-40"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="grid size-7 place-items-center text-ink-60 hover:text-sale"
      >
        <Icon name="trash" size={14} />
      </button>
    </div>
  );
}

function ImagesSection({ product }: { product: ProductForForm }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await uploadProductImageAction(product.id, formData);
    setPending(false);
    if (result.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
  }

  async function onDelete(imageId: string) {
    if (!confirm('Remover imagem?')) return;
    await deleteProductImageAction(product.id, imageId);
  }

  return (
    <Card title="Imagens">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {product.images.map((img) => (
          <div key={img.id} className="relative aspect-[4/5] border border-line bg-cream">
            <img src={img.url} alt={img.alt ?? ''} className="size-full object-cover" />
            <button
              type="button"
              onClick={() => onDelete(img.id)}
              className="absolute top-2 right-2 grid size-7 place-items-center bg-paper/95 text-ink-60 hover:text-sale"
            >
              <Icon name="trash" size={12} />
            </button>
          </div>
        ))}
        {product.images.length === 0 && (
          <div className="col-span-full text-body-sm text-ink-60">
            Nenhuma imagem. Faça upload abaixo.
          </div>
        )}
      </div>

      <form ref={formRef} action={onSubmit} className="flex flex-col gap-3">
        <LabeledField label="Selecionar arquivo">
          <input type="file" name="file" accept="image/*" required />
        </LabeledField>
        <LabeledField label="Texto alternativo" optional>
          <input type="text" name="alt" placeholder="Descrição da imagem" />
        </LabeledField>
        {error && <div className="text-eyebrow text-sale">{error}</div>}
        <Button type="submit" variant="secondary" size="sm" disabled={pending}>
          {pending ? 'Enviando…' : 'Subir imagem'}
        </Button>
      </form>
    </Card>
  );
}
