'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { createAddressAction, type FormState } from '@/lib/auth/customer-actions';

const INITIAL: FormState = {};

interface Props {
  onClose: () => void;
}

export function AddressForm({ onClose }: Props) {
  const [state, formAction, pending] = useActionState(createAddressAction, INITIAL);

  if (state.ok) {
    queueMicrotask(onClose);
  }

  return (
    <section className="border border-line bg-paper p-6">
      <h3 className="mb-4 font-display text-h5">Novo endereço</h3>
      <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Apelido">
          <input type="text" name="label" placeholder="Casa, Trabalho…" />
        </Field>
        <Field label="Destinatário">
          <input type="text" name="recipient" required placeholder="Nome completo" />
        </Field>
        <Field label="CEP">
          <input type="text" name="zipCode" required placeholder="00000-000" />
        </Field>
        <div />
        <Field label="Endereço">
          <input type="text" name="street" required placeholder="Rua, avenida…" />
        </Field>
        <Field label="Número">
          <input type="text" name="number" required placeholder="123" />
        </Field>
        <Field label="Complemento (opcional)">
          <input type="text" name="complement" placeholder="Apto, bloco" />
        </Field>
        <Field label="Bairro">
          <input type="text" name="neighborhood" required placeholder="Bairro" />
        </Field>
        <Field label="Cidade">
          <input type="text" name="city" required placeholder="Cidade" />
        </Field>
        <Field label="UF">
          <input type="text" name="state" required maxLength={2} placeholder="SP" />
        </Field>

        <label className="md:col-span-2 flex items-center gap-2 text-body-sm text-ink-60">
          <input type="checkbox" name="isDefault" className="!w-auto !m-0" />
          Definir como endereço principal
        </label>

        {state.error && (
          <div className="md:col-span-2 border border-sale bg-[rgba(140,58,46,0.08)] px-3.5 py-2.5 text-body-sm text-sale">
            {state.error}
          </div>
        )}

        <div className="md:col-span-2 mt-2 flex gap-3">
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? 'Salvando…' : 'Salvar endereço'}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
        {label}
      </span>
      {children}
    </label>
  );
}
