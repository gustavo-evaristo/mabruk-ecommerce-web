'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { AddressForm } from './address-form';
import { deleteAddressAction } from '@/lib/auth/customer-actions';
import type { Address } from '@/lib/api/types';

interface Props {
  addresses: Address[];
}

export function AddressList({ addresses }: Props) {
  const [adding, setAdding] = useState(false);

  async function onDelete(id: string) {
    if (!confirm('Tem certeza que quer remover este endereço?')) return;
    await deleteAddressAction(id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-h3">Endereços</h2>
          <p className="mt-1.5 text-body-sm text-ink-60">
            {addresses.length} {addresses.length === 1 ? 'endereço cadastrado' : 'endereços cadastrados'}
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

      {addresses.length === 0 && !adding && (
        <div className="flex flex-col items-center gap-4 border border-dashed border-line bg-paper py-12 text-center">
          <Icon name="map" size={32} className="text-ink-40" />
          <p className="text-body-sm text-ink-60">
            Nenhum endereço cadastrado. Adicione um para acelerar o checkout.
          </p>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {addresses.map((a) => (
            <article key={a.id} className="border border-line bg-paper p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-h6">{a.label ?? 'Endereço'}</h3>
                  {a.isDefault && <Tag variant="champagne">Principal</Tag>}
                </div>
                <div className="flex gap-3 text-ink-60">
                  <button
                    type="button"
                    aria-label="Excluir"
                    onClick={() => onDelete(a.id)}
                    className="cursor-pointer hover:text-sale"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
              <div className="mt-3 text-body-sm leading-relaxed text-ink-80">
                {a.recipient}
                <br />
                {a.street}, {a.number}
                {a.complement && ` · ${a.complement}`}
                <br />
                {a.neighborhood}, {a.city}, {a.state}
                <br />
                <span className="font-mono nums">{a.zipCode}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {adding && <AddressForm onClose={() => setAdding(false)} />}
    </div>
  );
}
