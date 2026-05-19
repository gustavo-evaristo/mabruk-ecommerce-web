'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/icon';

interface VariantOption {
  /** SKU da variante (será matcheado no backend após criação). */
  sku: string;
  /** Texto exibido no select. */
  label: string;
}

interface Props {
  /** Nome do campo no form (será serializado como múltiplas entradas). */
  name: string;
  /**
   * Quando passado, cada foto pode ser vinculada a uma variante via SKU.
   * O array `photoVariantSkus` é enviado em paralelo a `photos` no FormData,
   * na mesma ordem (string vazia = foto global).
   */
  variantOptions?: VariantOption[];
}

interface FileWithVariant {
  file: File;
  /** SKU da variante escolhida, ou '' se for foto global. */
  variantSku: string;
}

/**
 * Seletor múltiplo de fotos com preview. Quando `variantOptions` é passado,
 * cada foto recebe um select pra vincular a uma variante específica.
 */
export function PhotosPicker({ name, variantOptions }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<FileWithVariant[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = items.map((i) => URL.createObjectURL(i.file));
    setPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [items]);

  // Mantém o input nativo sincronizado com a lista de files (ordem importa).
  useEffect(() => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    items.forEach((i) => dt.items.add(i.file));
    inputRef.current.files = dt.files;
  }, [items]);

  // Se uma variantSku selecionada deixar de existir (admin removeu a variante draft),
  // reseta o select pra global.
  useEffect(() => {
    if (!variantOptions) return;
    const validSkus = new Set(variantOptions.map((v) => v.sku));
    setItems((prev) =>
      prev.map((i) =>
        i.variantSku && !validSkus.has(i.variantSku) ? { ...i, variantSku: '' } : i,
      ),
    );
  }, [variantOptions]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith('image/'),
    );
    setItems((prev) => [...prev, ...picked.map((file) => ({ file, variantSku: '' }))]);
  }

  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function setVariant(index: number, sku: string) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, variantSku: sku } : it)));
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        name={name}
        multiple
        accept="image/*"
        onChange={onPick}
        className="hidden"
        id={`${name}-input`}
      />

      {/* Hidden parallel array: variantSku por foto. Ordem igual à dos files. */}
      {items.map((it, i) => (
        <input key={i} type="hidden" name="photoVariantSkus" value={it.variantSku} />
      ))}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {previews.map((src, i) => (
          <div key={src} className="flex flex-col gap-2">
            <div className="relative aspect-[4/5] border border-line bg-cream">
              <img src={src} alt={items[i]?.file.name ?? ''} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-2 right-2 grid size-7 place-items-center bg-paper/95 text-ink-60 hover:text-sale"
                aria-label="Remover"
              >
                <Icon name="close" size={12} />
              </button>
              {i === 0 && (
                <span className="absolute top-2 left-2 bg-ink px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-paper">
                  Capa
                </span>
              )}
            </div>
            {variantOptions && variantOptions.length > 0 && (
              <select
                value={items[i].variantSku}
                onChange={(e) => setVariant(i, e.target.value)}
                className="!h-9 !py-1 text-body-xs"
              >
                <option value="">— Foto global —</option>
                {variantOptions.map((opt) => (
                  <option key={opt.sku} value={opt.sku}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}

        <label
          htmlFor={`${name}-input`}
          className="flex aspect-[4/5] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-ink-20 bg-cream text-ink-60 hover:border-ink hover:text-ink"
        >
          <Icon name="plus" size={20} />
          <span className="text-[10px] uppercase tracking-wide">
            {items.length === 0 ? 'Adicionar fotos' : 'Adicionar mais'}
          </span>
        </label>
      </div>

      {items.length > 0 && (
        <div className="text-eyebrow text-ink-60">
          {items.length} {items.length === 1 ? 'foto selecionada' : 'fotos selecionadas'} · a
          primeira vira capa do produto. Você pode reorganizar/excluir depois.
        </div>
      )}
    </div>
  );
}
