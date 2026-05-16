'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';

interface Address {
  id: string;
  label: string;
  recipient: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

const INITIAL: Address[] = [
  {
    id: 'a1',
    label: 'Casa',
    recipient: 'Gustavo Evaristo',
    street: 'R. Bela Cintra, 1024 · apto 82',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01415-003',
    phone: '(11) 99821-4471',
    isDefault: true,
  },
  {
    id: 'a2',
    label: 'Trabalho',
    recipient: 'Gustavo Evaristo',
    street: 'Av. Faria Lima, 3144 · 15º andar',
    neighborhood: 'Itaim Bibi',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '04538-133',
    phone: '(11) 99821-4471',
    isDefault: false,
  },
];

export default function EnderecosPage() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL);
  const [adding, setAdding] = useState(false);

  function setDefault(id: string) {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }

  function remove(id: string) {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-h3">Endereços</h2>
          <p className="mt-1.5 text-body-sm text-ink-60">
            {addresses.length} endereços cadastrados
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Icon name="plus" size={12} />}
          onClick={() => setAdding(true)}
        >
          Novo endereço
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {addresses.map((a) => (
          <article key={a.id} className="border border-line bg-paper p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-h6">{a.label}</h3>
                {a.isDefault && <Tag variant="champagne">Principal</Tag>}
              </div>
              <div className="flex gap-3 text-ink-60">
                <button type="button" aria-label="Editar" className="hover:text-ink">
                  <Icon name="edit" size={14} />
                </button>
                <button
                  type="button"
                  aria-label="Excluir"
                  onClick={() => remove(a.id)}
                  className="hover:text-ink"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
            <div className="mt-3 text-body-sm leading-relaxed text-ink-80">
              {a.recipient}
              <br />
              {a.street}
              <br />
              {a.neighborhood}, {a.city}, {a.state}
              <br />
              <span className="font-mono nums">{a.zipCode}</span>
              <br />
              <span className="text-ink-60">{a.phone}</span>
            </div>
            {!a.isDefault && (
              <button
                type="button"
                onClick={() => setDefault(a.id)}
                className="mt-4 text-eyebrow font-medium uppercase tracking-eyebrow text-ink underline"
              >
                Tornar principal
              </button>
            )}
          </article>
        ))}
      </div>

      {adding && (
        <section className="border border-line bg-paper p-6">
          <h3 className="mb-4 font-display text-h5">Novo endereço</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Apelido">
              <input type="text" placeholder="Casa, Trabalho…" />
            </Field>
            <Field label="Destinatário">
              <input type="text" placeholder="Nome completo" />
            </Field>
            <Field label="CEP">
              <input type="text" placeholder="00000-000" />
            </Field>
            <div />
            <Field label="Endereço">
              <input type="text" placeholder="Rua, avenida…" />
            </Field>
            <Field label="Número">
              <input type="text" placeholder="123" />
            </Field>
            <Field label="Complemento (opcional)">
              <input type="text" placeholder="Apto, bloco" />
            </Field>
            <Field label="Bairro">
              <input type="text" placeholder="Bairro" />
            </Field>
            <Field label="Cidade">
              <input type="text" placeholder="Cidade" />
            </Field>
            <Field label="UF">
              <input type="text" placeholder="SP" />
            </Field>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="primary" onClick={() => setAdding(false)}>
              Salvar endereço
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Cancelar
            </Button>
          </div>
        </section>
      )}
    </div>
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
