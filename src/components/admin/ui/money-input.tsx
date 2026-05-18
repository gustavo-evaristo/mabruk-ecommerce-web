'use client';

import { useState } from 'react';

interface Props {
  name: string;
  initialCents: number;
  placeholder?: string;
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function parseToCents(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10);
}

/**
 * Input que aceita digitação como dinheiro (R$ X,XX) e submete o valor em centavos.
 * A formatação acontece a cada tecla, no padrão BR.
 */
export function MoneyInput({ name, initialCents, placeholder }: Props) {
  const [cents, setCents] = useState(initialCents);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCents(parseToCents(e.target.value));
  }

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        value={cents === 0 ? '' : formatBRL(cents)}
        onChange={onChange}
        placeholder={placeholder ?? 'R$ 0,00'}
        className="font-mono"
      />
      <input type="hidden" name={name} value={cents} />
    </>
  );
}
