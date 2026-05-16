'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils/cn';

interface Section {
  title: string;
  fields: { label: string; value: string }[];
}

const SECTIONS: Section[] = [
  {
    title: 'Dados de contato',
    fields: [
      { label: 'Nome completo', value: 'Gustavo Evaristo' },
      { label: 'E-mail', value: 'gustavo@email.com.br' },
      { label: 'Telefone', value: '(11) 99821-4471' },
      { label: 'CPF', value: '328.***.***-22' },
      { label: 'Data de nascimento', value: '12/04/1992' },
    ],
  },
  {
    title: 'Preferências',
    fields: [
      { label: 'Comunicação por e-mail', value: 'Ativada' },
      { label: 'Comunicação por WhatsApp', value: 'Desativada' },
      { label: 'Idioma', value: 'Português (BR)' },
    ],
  },
];

export default function DadosPessoaisPage() {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-h3">Dados pessoais</h2>
        <p className="mt-1.5 text-body-sm text-ink-60">
          Mantenha seus dados atualizados para garantir entregas certeiras.
        </p>
      </div>

      {SECTIONS.map((sec) => {
        const isEditing = editing === sec.title;
        return (
          <section key={sec.title} className="border border-line bg-paper p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-h5">{sec.title}</h3>
              <button
                type="button"
                onClick={() => setEditing(isEditing ? null : sec.title)}
                className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink underline"
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {sec.fields.map((f) => (
                <div key={f.label}>
                  <div className="eyebrow">{f.label}</div>
                  {isEditing ? (
                    <input type="text" defaultValue={f.value} className="mt-1.5" />
                  ) : (
                    <div className="mt-1.5 text-body">{f.value}</div>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="mt-6 flex gap-3">
                <Button variant="primary" size="sm" onClick={() => setEditing(null)} icon={<Icon name="check" size={12} />}>
                  Salvar alterações
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
              </div>
            )}
          </section>
        );
      })}

      <section className="border border-line p-6">
        <h3 className="font-display text-h5">Senha</h3>
        <p className="mt-1.5 text-body-sm text-ink-60">
          Altere sua senha para manter sua conta segura.
        </p>
        <Button variant="secondary" size="sm" className="mt-4" icon={<Icon name="lock" size={12} />}>
          Alterar senha
        </Button>
      </section>

      <section className={cn('p-6 text-body-sm leading-relaxed text-sale')}>
        <h3 className="font-display text-h6 text-sale">Excluir minha conta</h3>
        <p className="mt-1 text-ink-60">
          Esta ação remove permanentemente seus dados. Pedidos antigos são mantidos por
          obrigação fiscal.
        </p>
        <Button variant="danger" size="sm" className="mt-4">
          Solicitar exclusão
        </Button>
      </section>
    </div>
  );
}
