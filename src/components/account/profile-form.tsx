'use client';

import { useState, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { updateProfileAction, type FormState } from '@/lib/auth/customer-actions';
import type { Customer } from '@/lib/api/types';

const INITIAL: FormState = {};

interface Props {
  customer: Customer;
}

export function ProfileForm({ customer }: Props) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateProfileAction, INITIAL);

  if (state.ok && editing) {
    // Sai do modo edição quando salvar com sucesso
    setEditing(false);
  }

  return (
    <section className="border border-line bg-paper p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-h5">Dados de contato</h3>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="cursor-pointer text-eyebrow font-medium uppercase tracking-eyebrow text-ink underline"
        >
          {editing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome completo" readOnly={!editing}>
          <input type="text" name="name" defaultValue={customer.name} readOnly={!editing} />
        </Field>
        <Field label="E-mail" readOnly>
          <input type="email" defaultValue={customer.email} readOnly disabled />
        </Field>
        <Field label="Telefone" readOnly={!editing}>
          <input
            type="tel"
            name="phone"
            defaultValue={customer.phone ?? ''}
            readOnly={!editing}
          />
        </Field>
        <Field label="CPF/CNPJ" readOnly={!editing}>
          <input
            type="text"
            name="cpfCnpj"
            defaultValue={customer.cpfCnpj ?? ''}
            readOnly={!editing}
          />
        </Field>

        {state.error && editing && (
          <div className="sm:col-span-2 border border-sale bg-[rgba(140,58,46,0.08)] px-3.5 py-2.5 text-body-sm text-sale">
            {state.error}
          </div>
        )}

        {editing && (
          <div className="sm:col-span-2 mt-2 flex gap-3">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={pending}
              icon={<Icon name="check" size={12} />}
            >
              {pending ? 'Salvando…' : 'Salvar alterações'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
            >
              Cancelar
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}

function Field({
  label,
  children,
  readOnly,
}: {
  label: string;
  children: React.ReactNode;
  readOnly?: boolean;
}) {
  return (
    <div className={readOnly ? 'opacity-100' : ''}>
      <div className="eyebrow">{label}</div>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
