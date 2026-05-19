'use client';

import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface Props {
  /** Nome do campo no FormData (renderizado como hidden input). */
  name: string;
  defaultValue?: string | null;
  /** Override controlado opcional. */
  value?: string | null;
  onChange?: (hex: string) => void;
  placeholder?: string;
}

const HEX_RE = /^#?[0-9a-fA-F]{0,6}$/;

function normalize(hex: string): string {
  if (!hex) return '';
  return hex.startsWith('#') ? hex : `#${hex}`;
}

export function ColorPicker({
  name,
  defaultValue,
  value,
  onChange,
  placeholder = '#1E40AF',
}: Props) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string>(defaultValue ?? '');
  const current = isControlled ? value ?? '' : internal;
  const [open, setOpen] = useState(false);
  const popRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  function setColor(next: string) {
    if (isControlled) {
      onChange?.(next);
    } else {
      setInternal(next);
      onChange?.(next);
    }
  }

  // Fecha popover ao clicar fora
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const validForPicker = /^#[0-9a-fA-F]{6}$/.test(current);
  const pickerColor = validForPicker ? current : '#000000';

  return (
    <div className="relative flex items-center gap-2">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Escolher cor"
        className="grid size-9 shrink-0 place-items-center border border-line bg-paper"
      >
        <span
          className="size-6 border border-line"
          style={{ backgroundColor: current || '#fff' }}
        />
      </button>
      <input
        type="text"
        value={current}
        onChange={(e) => {
          let v = e.target.value.trim();
          if (!HEX_RE.test(v.replace(/^#/, '#'))) return;
          if (v && !v.startsWith('#')) v = `#${v}`;
          setColor(v);
        }}
        placeholder={placeholder}
        className="!h-9 font-mono"
      />
      <input type="hidden" name={name} value={normalize(current)} />

      {open && (
        <div
          ref={popRef}
          className="absolute top-full left-0 z-30 mt-2 border border-line bg-paper p-3 shadow-modal"
        >
          <HexColorPicker
            color={pickerColor}
            onChange={(hex) => setColor(hex)}
          />
          <div className="mt-3 flex items-center gap-2 text-eyebrow text-ink-60">
            <span className="font-mono">{current || '—'}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto text-eyebrow text-ink underline"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
