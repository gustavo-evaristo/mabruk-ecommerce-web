'use client';

import { useActionState, useRef, useState } from 'react';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  deleteTagAction,
  saveTagAction,
  type ActionState,
} from '@/lib/auth/admin-catalog-actions';
import type { AdminTag } from '@/lib/api/endpoints/admin';

const INITIAL: ActionState = {};

interface Props {
  tags: AdminTag[];
}

export function TagManager({ tags }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card title="Tags cadastradas">
        {tags.length === 0 ? (
          <div className="py-10 text-center text-body-sm text-ink-60">
            Nenhuma tag. Crie a primeira ao lado.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <TagChip key={t.id} tag={t} />
            ))}
          </div>
        )}
      </Card>

      <CreateTagForm />
    </div>
  );
}

function CreateTagForm() {
  const [state, formAction, pending] = useActionState(
    saveTagAction.bind(null, null),
    INITIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <Card title="Nova tag">
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <LabeledField label="Nome">
          <input name="name" type="text" required placeholder="Ex: Dia a dia" />
        </LabeledField>
        <LabeledField label="Slug" optional>
          <input
            name="slug"
            type="text"
            placeholder="dia-a-dia (auto se vazio)"
            className="font-mono"
          />
        </LabeledField>
        {state.error && (
          <div className="text-eyebrow text-sale">{state.error}</div>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={pending} fullWidth>
          {pending ? 'Criando…' : '+ Criar tag'}
        </Button>
      </form>
    </Card>
  );
}

function TagChip({ tag }: { tag: AdminTag }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    saveTagAction.bind(null, tag.id),
    INITIAL,
  );

  if (state.ok && editing) {
    queueMicrotask(() => setEditing(false));
  }

  async function onDelete() {
    if (!confirm(`Excluir a tag "${tag.name}"?`)) return;
    await deleteTagAction(tag.id);
  }

  if (editing) {
    return (
      <form action={formAction} className="flex items-center gap-1.5">
        <input
          name="name"
          defaultValue={tag.name}
          required
          className="!h-8 !w-32 !py-1 !text-body-sm"
        />
        <input
          name="slug"
          defaultValue={tag.slug}
          className="!h-8 !w-32 !py-1 !font-mono !text-eyebrow"
        />
        <button
          type="submit"
          disabled={pending}
          className="grid size-7 place-items-center text-success hover:text-ink"
          aria-label="Salvar"
        >
          <Icon name="check" size={14} />
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="grid size-7 place-items-center text-ink-60 hover:text-ink"
          aria-label="Cancelar"
        >
          <Icon name="close" size={14} />
        </button>
      </form>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 bg-cream px-3 py-1.5 text-body-sm">
      <span>{tag.name}</span>
      <span className="font-mono text-eyebrow text-ink-60">/{tag.slug}</span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="ml-1 text-ink-60 hover:text-ink"
        aria-label="Editar"
      >
        <Icon name="edit" size={12} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="text-ink-60 hover:text-sale"
        aria-label="Excluir"
      >
        <Icon name="close" size={12} />
      </button>
    </span>
  );
}
