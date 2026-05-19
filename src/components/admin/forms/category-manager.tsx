'use client';

import { useActionState, useRef, useState } from 'react';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  type ActionState,
} from '@/lib/auth/admin-catalog-actions';
import type { AdminCategory } from '@/lib/api/endpoints/admin';

const INITIAL: ActionState = {};

interface Props {
  categories: AdminCategory[];
}

export function CategoryManager({ categories }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card title="Categorias cadastradas">
        {categories.length === 0 ? (
          <div className="py-10 text-center text-body-sm text-ink-60">
            Nenhuma categoria. Crie a primeira ao lado.
          </div>
        ) : (
          categories.map((c, i) => (
            <CategoryRow
              key={c.id}
              category={c}
              isLast={i === categories.length - 1}
            />
          ))
        )}
      </Card>

      <CreateCategoryForm />
    </div>
  );
}

function CreateCategoryForm() {
  const [state, formAction, pending] = useActionState(createCategoryAction, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <Card title="Nova categoria">
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <LabeledField label="Nome">
          <input name="name" type="text" required placeholder="Ex: Anéis" />
        </LabeledField>
        <LabeledField label="Slug (URL)" optional>
          <input
            name="slug"
            type="text"
            placeholder="auto-gerado se vazio"
            className="font-mono"
          />
        </LabeledField>
        {state.error && (
          <div className="text-eyebrow text-sale">{state.error}</div>
        )}
        <Button type="submit" variant="primary" size="sm" disabled={pending} fullWidth>
          {pending ? 'Criando…' : '+ Criar categoria'}
        </Button>
      </form>
    </Card>
  );
}

function CategoryRow({
  category,
  isLast,
}: {
  category: AdminCategory;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateCategoryAction.bind(null, category.id),
    INITIAL,
  );

  if (state.ok && editing) {
    queueMicrotask(() => setEditing(false));
  }

  async function onDelete() {
    if (!confirm(`Excluir a categoria "${category.name}"?`)) return;
    await deleteCategoryAction(category.id);
  }

  if (editing) {
    return (
      <form
        action={formAction}
        className={`grid items-center gap-3 py-3.5 ${
          !isLast ? 'border-b border-line' : ''
        }`}
        style={{ gridTemplateColumns: '1fr 1fr 100px auto' }}
      >
        <input name="name" defaultValue={category.name} required />
        <input
          name="slug"
          defaultValue={category.slug}
          className="font-mono"
        />
        <label className="flex items-center gap-2 text-eyebrow text-ink-60">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={category.isActive}
            className="!w-auto !m-0"
          />
          Ativa
        </label>
        <div className="flex gap-1">
          <Button type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? '…' : 'Salvar'}
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
      </form>
    );
  }

  return (
    <div
      className={`grid items-center gap-3 py-3.5 text-body-sm ${
        !isLast ? 'border-b border-line' : ''
      }`}
      style={{ gridTemplateColumns: '1fr 1fr 80px auto' }}
    >
      <span className="font-medium">{category.name}</span>
      <span className="font-mono text-eyebrow text-ink-60">/{category.slug}</span>
      <span
        className={`text-eyebrow ${
          category.isActive ? 'text-success' : 'text-ink-40'
        }`}
      >
        {category.isActive ? '● Ativa' : '○ Inativa'}
      </span>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="grid size-7 place-items-center text-ink-60 hover:text-ink"
          aria-label="Editar"
        >
          <Icon name="edit" size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="grid size-7 place-items-center text-ink-60 hover:text-sale"
          aria-label="Excluir"
        >
          <Icon name="trash" size={14} />
        </button>
      </div>
    </div>
  );
}
