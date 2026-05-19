'use client';

import { useActionState, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { useQueryClient } from '@tanstack/react-query';
import { Card, LabeledField, MoneyInput } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  saveProductAction,
  deleteProductAction,
  createVariantAction,
  deleteVariantAction,
  uploadProductImageWithVariantAction,
  deleteProductImageAction,
  adjustStockAction,
  generateVariantsAction,
  reorderProductImagesAction,
  type ActionState,
} from '@/lib/auth/admin-product-actions';
import type {
  AdminAttribute,
  AdminCategory,
  AdminTag,
} from '@/lib/api/endpoints/admin';
import type {
  ProductAttributeDefinition,
  VariantAttributeValue,
} from '@/lib/api/types';
import { PhotosPicker } from './photos-picker';
import { SortableImageGrid } from './sortable-image-grid';

const INITIAL: ActionState = {};

interface ProductForForm {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  type: 'SIMPLE' | 'VARIABLE';
  basePriceCents: number;
  sku: string | null;
  priceCents: number | null;
  stock: number;
  weightInGrams: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  category: { id: string };
  tagIds?: string[];
  attributes: ProductAttributeDefinition[];
  variants: {
    id: string;
    sku: string;
    priceCents: number;
    stock: number;
    isDefault: boolean;
    attributeValues: VariantAttributeValue[];
  }[];
  images: { id: string; url: string; alt: string | null; variantId: string | null }[];
}

interface Props {
  product: ProductForForm | null;
  categories: AdminCategory[];
  tags: AdminTag[];
  attributes: AdminAttribute[];
}

export function ProductForm({ product, categories, tags, attributes }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = product?.id ?? null;
  const isNew = !id;

  const [type, setType] = useState<'SIMPLE' | 'VARIABLE'>(product?.type ?? 'SIMPLE');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(product?.tagIds ?? []),
  );
  const [selectedAttributeIds, setSelectedAttributeIds] = useState<Set<string>>(
    new Set(product?.attributes.map((a) => a.id) ?? []),
  );
  /** Drafts de variantes (só em criação VARIABLE). Compartilhado com PhotosPicker pra linkar foto à variante. */
  const [variantDrafts, setVariantDrafts] = useState<DraftVariant[]>([]);

  const selectedAttributes = useMemo(
    () => attributes.filter((a) => selectedAttributeIds.has(a.id)),
    [attributes, selectedAttributeIds],
  );

  // Opções pro PhotosPicker (SKU + label legível). Só pra criação VARIABLE.
  const photoVariantOptions = useMemo(() => {
    if (!isNew || type !== 'VARIABLE') return undefined;
    return variantDrafts
      .filter((d) => d.sku.trim().length > 0)
      .map((d) => {
        const labelParts = selectedAttributes
          .map((a) => {
            const val = a.values.find((v) => v.id === d.values[a.id]);
            return val?.name;
          })
          .filter(Boolean);
        return {
          sku: d.sku.trim(),
          label: labelParts.length ? `${d.sku} · ${labelParts.join(' · ')}` : d.sku,
        };
      });
  }, [isNew, type, variantDrafts, selectedAttributes]);
  const [state, formAction, pending] = useActionState(
    saveProductAction.bind(null, id),
    INITIAL,
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  if (state.ok && isNew && state.id) {
    queueMicrotask(() => router.push(`/admin/produtos/${state.id}/editar`));
  }

  async function onDelete() {
    if (!id) return;
    setDeletePending(true);
    try {
      await deleteProductAction(id);
      await queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      router.push('/admin/produtos');
    } finally {
      setDeletePending(false);
      setConfirmDeleteOpen(false);
    }
  }

  return (
    <>
      <form action={formAction} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
        <div className="flex flex-col gap-4">
          <Card title="Informações básicas">
            <div className="flex flex-col gap-4">
              <LabeledField label="Tipo de produto">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setType('SIMPLE')}
                    className={`flex-1 border px-4 py-3 text-left text-body-sm ${
                      type === 'SIMPLE'
                        ? 'border-ink bg-cream'
                        : 'border-line bg-paper text-ink-60 hover:border-ink-60'
                    }`}
                  >
                    <strong className="block text-ink">Simples</strong>
                    Um SKU único. Ex.: anel só em prata, tamanho único.
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('VARIABLE')}
                    className={`flex-1 border px-4 py-3 text-left text-body-sm ${
                      type === 'VARIABLE'
                        ? 'border-ink bg-cream'
                        : 'border-line bg-paper text-ink-60 hover:border-ink-60'
                    }`}
                  >
                    <strong className="block text-ink">Variável</strong>
                    Múltiplas variações. Ex.: brinco em ouro/prata × azul/vermelho.
                  </button>
                </div>
                <input type="hidden" name="type" value={type} />
              </LabeledField>

              <LabeledField label="Nome do produto">
                <input type="text" name="name" defaultValue={product?.name ?? ''} required />
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
                <textarea name="description" rows={4} defaultValue={product?.description ?? ''} />
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
              {type === 'VARIABLE' && (
                <div className="grid grid-cols-2 gap-4">
                  <LabeledField label="Preço base (a partir de)">
                    <MoneyInput
                      name="basePriceCents"
                      initialCents={product?.basePriceCents ?? 0}
                    />
                  </LabeledField>
                  <LabeledField label="Peso (g)" optional>
                    <input
                      type="number"
                      name="weightInGrams"
                      defaultValue={product?.weightInGrams ?? ''}
                      min={0}
                      step="0.01"
                      className="font-mono"
                      placeholder="ex: 2.5"
                    />
                  </LabeledField>
                </div>
              )}

              {type === 'SIMPLE' && (
                <div className="grid grid-cols-[1fr_120px_100px_100px] gap-4">
                  <LabeledField label="SKU">
                    <input
                      type="text"
                      name="sku"
                      defaultValue={product?.sku ?? ''}
                      required={isNew}
                      className="font-mono"
                      placeholder="MAB-001"
                    />
                  </LabeledField>
                  <LabeledField label="Preço">
                    <MoneyInput
                      name="priceCents"
                      initialCents={product?.priceCents ?? product?.basePriceCents ?? 0}
                    />
                  </LabeledField>
                  <LabeledField label="Estoque">
                    <input
                      type="number"
                      name="stock"
                      defaultValue={product?.stock ?? 0}
                      min={0}
                      className="text-center font-mono"
                    />
                  </LabeledField>
                  <LabeledField label="Peso (g)" optional>
                    <input
                      type="number"
                      name="weightInGrams"
                      defaultValue={product?.weightInGrams ?? ''}
                      min={0}
                      step="0.01"
                      className="font-mono"
                      placeholder="ex: 2.5"
                    />
                  </LabeledField>
                </div>
              )}
            </div>
          </Card>

          {type === 'VARIABLE' && (
            <Card title="Atributos do produto">
              <p className="mb-3 text-body-sm text-ink-60">
                Selecione quais atributos esse produto vai variar (ex: Cor + Banho). Cada combinação
                vira uma variante separada com SKU, preço, estoque e fotos próprios.
              </p>
              {attributes.length === 0 ? (
                <div className="text-body-sm text-ink-60">
                  Nenhum atributo cadastrado.{' '}
                  <Link href={'/admin/atributos' as Route} className="text-ink underline">
                    Crie em /admin/atributos
                  </Link>
                  .
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {attributes.map((a) => {
                    const checked = selectedAttributeIds.has(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          const next = new Set(selectedAttributeIds);
                          if (next.has(a.id)) next.delete(a.id);
                          else next.add(a.id);
                          setSelectedAttributeIds(next);
                        }}
                        className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-body-sm transition-colors ${
                          checked
                            ? 'border-ink bg-ink text-paper'
                            : 'border-line bg-paper text-ink-80 hover:border-ink'
                        }`}
                      >
                        {checked && <Icon name="check" size={11} />}
                        {a.name}
                        <span className="opacity-60">({a.values.length})</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {Array.from(selectedAttributeIds).map((aid) => (
                <input key={aid} type="hidden" name="attributeIds" value={aid} />
              ))}
            </Card>
          )}

          {isNew && type === 'VARIABLE' && selectedAttributeIds.size > 0 && (
            <InitialVariantsSection
              attributes={selectedAttributes}
              drafts={variantDrafts}
              onChange={setVariantDrafts}
            />
          )}

          <Card title="Tags">
            {tags.length === 0 ? (
              <div className="text-body-sm text-ink-60">
                Nenhuma tag cadastrada.{' '}
                <Link href={'/admin/tags' as Route} className="text-ink underline">
                  Crie tags em /admin/tags
                </Link>
                .
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => {
                  const checked = selectedTags.has(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        const next = new Set(selectedTags);
                        if (next.has(t.id)) next.delete(t.id);
                        else next.add(t.id);
                        setSelectedTags(next);
                      }}
                      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-body-sm transition-colors ${
                        checked
                          ? 'border-ink bg-ink text-paper'
                          : 'border-line bg-paper text-ink-80 hover:border-ink'
                      }`}
                    >
                      {checked && <Icon name="check" size={11} />}
                      {t.name}
                    </button>
                  );
                })}
              </div>
            )}
            {Array.from(selectedTags).map((id) => (
              <input key={id} type="hidden" name="tagIds" value={id} />
            ))}
          </Card>

          <Card title="SEO">
            <div className="flex flex-col gap-4">
              <LabeledField label="Meta título" optional>
                <input type="text" name="seoTitle" defaultValue={product?.seoTitle ?? ''} />
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

          {isNew && (
            <Card title="Fotos do produto">
              <p className="mb-3 text-body-sm text-ink-60">
                {type === 'VARIABLE'
                  ? 'Pra cada foto, escolha "Foto global" (aparece em todas as variantes) ou vincule a uma variante específica. Cadastre as variantes acima antes de subir as fotos.'
                  : 'As fotos enviadas formam a galeria do produto.'}
              </p>
              <PhotosPicker name="photos" variantOptions={photoVariantOptions} />
            </Card>
          )}
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
                onClick={() => setConfirmDeleteOpen(true)}
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
      {product && product.type === 'VARIABLE' && (
        <div className="px-6 pb-6 lg:px-10">
          <VariantsSection product={product} />
        </div>
      )}

      {product && (
        <div className="px-6 pb-10 lg:px-10">
          <ImagesSection product={product} />
        </div>
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        tone="danger"
        title="Excluir este produto?"
        description="O produto vai para a lixeira por 30 dias. Durante esse período você pode restaurá-lo. Após 30 dias ele será apagado permanentemente."
        confirmLabel="Mover para lixeira"
        loading={deletePending}
        onConfirm={onDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </>
  );
}

// ============================================================
// Variantes (só pra produto VARIABLE já criado)
// ============================================================

function VariantsSection({ product }: { product: ProductForForm }) {
  const [state, formAction, pending] = useActionState(
    createVariantAction.bind(null, product.id),
    INITIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  // ordena variantes preservando default por último
  const variants = useMemo(
    () =>
      [...product.variants].sort((a, b) => {
        if (a.isDefault && !b.isDefault) return 1;
        if (!a.isDefault && b.isDefault) return -1;
        return a.sku.localeCompare(b.sku);
      }),
    [product.variants],
  );

  return (
    <Card title="Variantes">
      <div className="mb-4 flex items-center gap-2">
        <p className="flex-1 text-body-sm text-ink-60">
          {product.attributes.length === 0
            ? 'Nenhum atributo selecionado. Adicione atributos no formulário acima e salve.'
            : `Cada variante = combinação de ${product.attributes.map((a) => a.name).join(' × ')}.`}
        </p>
        {product.attributes.length > 0 && (
          <GenerateVariantsButton
            productId={product.id}
            basePriceCents={product.basePriceCents}
          />
        )}
      </div>

      <div className="mb-4 border border-line">
        {variants.length === 0 ? (
          <div className="px-3 py-6 text-center text-body-sm text-ink-60">
            Nenhuma variante. Adicione abaixo ou clique em "Gerar combinações".
          </div>
        ) : (
          variants.map((v) => (
            <VariantRow key={v.id} productId={product.id} variant={v} />
          ))
        )}
      </div>

      {product.attributes.length > 0 && (
        <form
          ref={formRef}
          action={formAction}
          className="flex flex-col gap-3 border-t border-line pt-4"
        >
          <div className="mb-1 text-eyebrow text-ink-60">Adicionar variante manualmente</div>
          <div className="grid items-end gap-3 md:grid-cols-[1fr_140px_100px_auto]">
            <LabeledField label="SKU">
              <input type="text" name="sku" required className="font-mono" placeholder="MAB-..." />
            </LabeledField>
            <LabeledField label="Preço">
              <MoneyInput name="priceCents" initialCents={product.basePriceCents} />
            </LabeledField>
            <LabeledField label="Estoque">
              <input
                type="number"
                name="stock"
                min={0}
                defaultValue={0}
                className="text-center font-mono"
              />
            </LabeledField>
            <Button type="submit" variant="primary" size="md" disabled={pending}>
              {pending ? '…' : '+ Adicionar'}
            </Button>
          </div>
          {/* Um select por atributo */}
          <div className="grid gap-3 md:grid-cols-2">
            {product.attributes.map((a) => (
              <LabeledField key={a.id} label={a.name}>
                <select name="attributeValueIds" required defaultValue="">
                  <option value="">— Selecione {a.name.toLowerCase()} —</option>
                  {a.values.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </LabeledField>
            ))}
          </div>
          {state.error && <div className="text-eyebrow text-sale">{state.error}</div>}
        </form>
      )}
    </Card>
  );
}

function GenerateVariantsButton({
  productId,
  basePriceCents,
}: {
  productId: string;
  basePriceCents: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onClick() {
    setPending(true);
    setMsg(null);
    const r = await generateVariantsAction(productId, {
      defaultPriceCents: basePriceCents,
      defaultStock: 0,
    });
    setPending(false);
    if (r.error) setMsg(r.error);
    else {
      setMsg(`Criadas: ${r.created ?? 0} · Existentes: ${r.skipped ?? 0}`);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onClick}
        disabled={pending}
      >
        {pending ? '…' : 'Gerar todas as combinações'}
      </Button>
      {msg && <span className="text-eyebrow text-ink-60">{msg}</span>}
    </div>
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
    if (!confirm(`Remover variante ${variant.sku}?`)) return;
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
      className="grid items-center gap-3 border-t border-line px-3 py-2.5 text-body-sm first:border-t-0"
      style={{ gridTemplateColumns: '140px 1fr 100px 110px 40px' }}
    >
      <span className="font-mono text-eyebrow">{variant.sku}</span>
      <div className="flex flex-wrap gap-1.5">
        {variant.attributeValues.map((av) => (
          <span
            key={av.valueId}
            className="inline-flex items-center gap-1 border border-line px-2 py-0.5 text-[10px] tracking-eyebrow"
          >
            {av.attributeType === 'COLOR' && av.valueHex && (
              <span
                className="inline-block size-3 border border-line"
                style={{ backgroundColor: av.valueHex }}
              />
            )}
            <span className="text-ink-60">{av.attributeName}:</span>
            <span className="font-medium">{av.valueName}</span>
          </span>
        ))}
        {variant.attributeValues.length === 0 && variant.isDefault && (
          <span className="text-eyebrow text-ink-60">Variante padrão (produto simples)</span>
        )}
      </div>
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
        disabled={pending || variant.isDefault}
        title={variant.isDefault ? 'Variante padrão não pode ser removida' : 'Remover variante'}
        className="grid size-7 place-items-center text-ink-60 hover:text-sale disabled:opacity-30"
      >
        <Icon name="trash" size={14} />
      </button>
    </div>
  );
}

// ============================================================
// Imagens — DnD reorder + vínculo a variante
// ============================================================

function ImagesSection({ product }: { product: ProductForForm }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [orderedIds, setOrderedIds] = useState<string[]>(product.images.map((i) => i.id));

  // recalcula se o product.images mudar (após server action refresh)
  if (
    orderedIds.length !== product.images.length ||
    orderedIds.some((id, i) => id !== product.images[i].id)
  ) {
    queueMicrotask(() => setOrderedIds(product.images.map((i) => i.id)));
  }

  async function onSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const result = await uploadProductImageWithVariantAction(product.id, formData);
    setPending(false);
    if (result.error) setError(result.error);
    else formRef.current?.reset();
  }

  async function onDelete(imageId: string) {
    if (!confirm('Remover imagem?')) return;
    await deleteProductImageAction(product.id, imageId);
  }

  async function onReorder(nextOrder: string[]) {
    setOrderedIds(nextOrder);
    await reorderProductImagesAction(product.id, nextOrder);
  }

  return (
    <Card title="Imagens">
      <p className="mb-3 text-body-sm text-ink-60">
        Arraste para reordenar. Imagens "Sem variante" são fallback no produto inteiro; imagens
        vinculadas a uma variante aparecem na galeria quando o cliente selecionar essa variante.
      </p>
      <SortableImageGrid
        images={product.images}
        orderedIds={orderedIds}
        onReorder={onReorder}
        onDelete={onDelete}
      />

      <form ref={formRef} action={onSubmit} className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
        <div className="grid items-end gap-3 md:grid-cols-[1fr_200px_auto]">
          <LabeledField label="Selecionar arquivo">
            <input type="file" name="file" accept="image/*" required />
          </LabeledField>
          {product.type === 'VARIABLE' && product.variants.length > 0 && (
            <LabeledField label="Vincular à variante" optional>
              <select name="variantId" defaultValue="">
                <option value="">— Sem variante (foto global) —</option>
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.sku}
                    {v.attributeValues.length > 0
                      ? ` · ${v.attributeValues.map((av) => av.valueName).join(' · ')}`
                      : ''}
                  </option>
                ))}
              </select>
            </LabeledField>
          )}
          <Button type="submit" variant="secondary" size="md" disabled={pending}>
            {pending ? 'Enviando…' : 'Subir imagem'}
          </Button>
        </div>
        <LabeledField label="Texto alt" optional>
          <input type="text" name="alt" placeholder="Descrição da imagem (acessibilidade)" />
        </LabeledField>
        {error && <div className="text-eyebrow text-sale">{error}</div>}
      </form>
    </Card>
  );
}

// ============================================================
// Variantes iniciais (na criação) — dinâmico baseado nos atributos selecionados
// ============================================================

interface DraftVariant {
  sku: string;
  /** Mapa attributeId → valueId */
  values: Record<string, string>;
  priceCents: number;
  stock: number;
}

const EMPTY_DRAFT: DraftVariant = { sku: '', values: {}, priceCents: 0, stock: 0 };

function InitialVariantsSection({
  attributes,
  drafts,
  onChange,
}: {
  attributes: AdminAttribute[];
  drafts: DraftVariant[];
  onChange: (next: DraftVariant[]) => void;
}) {
  const setDrafts = (updater: (prev: DraftVariant[]) => DraftVariant[]) =>
    onChange(updater(drafts));
  const [row, setRow] = useState<DraftVariant>(EMPTY_DRAFT);

  // Limpa values que viraram inválidos quando o admin desmarcou um atributo
  useMemo(() => {
    const validIds = new Set(attributes.map((a) => a.id));
    let changed = false;
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(row.values)) {
      if (validIds.has(k)) cleaned[k] = v;
      else changed = true;
    }
    if (changed) setRow((r) => ({ ...r, values: cleaned }));
    // Limpa drafts que ficaram com atributos faltantes
    setDrafts((prev) =>
      prev.filter((d) => attributes.every((a) => a.id in d.values)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, row.values]);

  function add() {
    if (!row.sku.trim()) return;
    // exige um valor por atributo
    if (!attributes.every((a) => row.values[a.id])) return;
    setDrafts((prev) => [...prev, row]);
    setRow(EMPTY_DRAFT);
  }

  function remove(idx: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== idx));
  }

  function generateAll() {
    // produto cartesiano de todos os valores dos atributos selecionados
    let combos: Record<string, string>[] = [{}];
    for (const a of attributes) {
      const next: Record<string, string>[] = [];
      for (const c of combos) {
        for (const v of a.values) {
          next.push({ ...c, [a.id]: v.id });
        }
      }
      combos = next;
    }
    // gera SKU sequencial a partir dos slugs dos valores
    const valById = new Map(
      attributes.flatMap((a) => a.values.map((v) => [v.id, v.slug])),
    );
    const newDrafts: DraftVariant[] = combos.map((values) => {
      const skuSuffix = Object.entries(values)
        .map(([, vid]) => valById.get(vid) ?? '')
        .join('-')
        .toUpperCase();
      return { sku: skuSuffix, values, priceCents: 0, stock: 0 };
    });
    setDrafts(() => newDrafts);
  }

  return (
    <Card title="Variantes iniciais">
      <p className="mb-3 text-body-sm text-ink-60">
        Adicione as variantes que esse produto vai ter. Cada uma combina um valor de cada atributo
        ({attributes.map((a) => a.name).join(' × ')}). Deixe o preço vazio para herdar do preço
        base.
      </p>

      <div className="mb-3 flex justify-end">
        <Button type="button" variant="secondary" size="sm" onClick={generateAll}>
          ⚡ Gerar todas as combinações ({attributes.reduce((acc, a) => acc * a.values.length, 1)})
        </Button>
      </div>

      {drafts.length > 0 && (
        <div className="mb-4 border border-line">
          {drafts.map((d, i) => (
            <div
              key={i}
              className="grid items-center gap-3 border-t border-line px-3 py-2.5 text-body-sm first:border-t-0 md:grid-cols-[140px_1fr_110px_70px_40px]"
            >
              <span className="font-mono text-eyebrow">{d.sku || '—'}</span>
              <div className="flex flex-wrap gap-1.5">
                {attributes.map((a) => {
                  const valueId = d.values[a.id];
                  const val = a.values.find((v) => v.id === valueId);
                  if (!val) return null;
                  return (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1 border border-line px-2 py-0.5 text-[10px] tracking-eyebrow"
                    >
                      {a.type === 'COLOR' && val.hex && (
                        <span
                          className="inline-block size-3 border border-line"
                          style={{ backgroundColor: val.hex }}
                        />
                      )}
                      <span className="text-ink-60">{a.name}:</span>
                      <span className="font-medium">{val.name}</span>
                    </span>
                  );
                })}
              </div>
              <span className="text-right font-mono">
                {d.priceCents > 0 ? (
                  (d.priceCents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })
                ) : (
                  <span className="text-ink-60">preço base</span>
                )}
              </span>
              <span className="text-center font-mono">{d.stock}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="grid size-7 place-items-center text-ink-60 hover:text-sale"
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <div className="text-eyebrow text-ink-60">Adicionar variante</div>

        {/* Linha 1: SKU + selects de cada atributo */}
        <div className="grid items-end gap-3 md:grid-cols-[1fr_repeat(auto-fit,minmax(140px,1fr))]">
          <LabeledField label="SKU">
            <input
              type="text"
              value={row.sku}
              onChange={(e) => setRow((r) => ({ ...r, sku: e.target.value }))}
              className="font-mono"
              placeholder="MAB-AN-001"
            />
          </LabeledField>
          {attributes.map((a) => (
            <LabeledField key={a.id} label={a.name}>
              <select
                value={row.values[a.id] ?? ''}
                onChange={(e) =>
                  setRow((r) => ({
                    ...r,
                    values: { ...r.values, [a.id]: e.target.value },
                  }))
                }
              >
                <option value="">— Selecione —</option>
                {a.values.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </LabeledField>
          ))}
        </div>

        {/* Linha 2: preço + estoque + botão */}
        <div className="grid items-end gap-3 md:grid-cols-[1fr_120px_90px_auto]">
          <div />
          <LabeledField label="Preço (opcional)" optional>
            <input
              type="text"
              inputMode="numeric"
              className="font-mono"
              placeholder="R$ 0,00"
              value={
                row.priceCents === 0
                  ? ''
                  : (row.priceCents / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })
              }
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                setRow((r) => ({ ...r, priceCents: digits ? Number(digits) : 0 }));
              }}
            />
          </LabeledField>
          <LabeledField label="Estoque">
            <input
              type="number"
              min={0}
              value={row.stock}
              onChange={(e) =>
                setRow((r) => ({ ...r, stock: Number(e.target.value) || 0 }))
              }
              className="text-center font-mono"
            />
          </LabeledField>
          <Button type="button" variant="primary" size="md" onClick={add}>
            + Adicionar
          </Button>
        </div>
      </div>

      <input type="hidden" name="initialVariants" value={JSON.stringify(drafts)} />
    </Card>
  );
}
