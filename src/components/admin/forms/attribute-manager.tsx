'use client';

import { useActionState, useRef, useState } from 'react';
import { Card, ColorPicker, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import {
  createAttributeAction,
  createAttributeValueAction,
  deleteAttributeAction,
  deleteAttributeValueAction,
  updateAttributeAction,
  updateAttributeValueAction,
  type ActionState,
} from '@/lib/auth/admin-catalog-actions';
import type { AdminAttribute, AdminAttributeValue } from '@/lib/api/endpoints/admin';

const INITIAL: ActionState = {};

interface Props {
  attributes: AdminAttribute[];
}

export function AttributeManager({ attributes }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        {attributes.length === 0 ? (
          <Card title="Atributos">
            <div className="py-10 text-center text-body-sm text-ink-60">
              Nenhum atributo cadastrado. Crie o primeiro ao lado.
            </div>
          </Card>
        ) : (
          attributes.map((a) => <AttributeCard key={a.id} attribute={a} />)
        )}
      </div>
      <CreateAttributeForm />
    </div>
  );
}

function CreateAttributeForm() {
  const [state, formAction, pending] = useActionState(createAttributeAction, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <Card title="Novo atributo">
      <form ref={formRef} action={formAction} className="flex flex-col gap-4">
        <LabeledField label="Nome">
          <input
            type="text"
            name="name"
            required
            placeholder="Ex: Cor, Banho, Tamanho"
          />
        </LabeledField>
        <LabeledField label="Slug (URL)" optional>
          <input
            type="text"
            name="slug"
            placeholder="auto-gerado se vazio"
            className="font-mono"
          />
        </LabeledField>
        <LabeledField label="Tipo">
          <select name="type" defaultValue="SELECT">
            <option value="SELECT">Lista (texto)</option>
            <option value="COLOR">Cor (com swatch)</option>
          </select>
        </LabeledField>
        {state.error && <div className="text-eyebrow text-sale">{state.error}</div>}
        <Button type="submit" variant="primary" size="sm" disabled={pending} fullWidth>
          {pending ? 'Criando…' : '+ Criar atributo'}
        </Button>
      </form>
    </Card>
  );
}

function AttributeCard({ attribute }: { attribute: AdminAttribute }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editState, editAction, editPending] = useActionState(
    updateAttributeAction.bind(null, attribute.id),
    INITIAL,
  );

  if (editState.ok && editing) {
    queueMicrotask(() => setEditing(false));
  }

  async function onConfirmDelete() {
    setDeletePending(true);
    setDeleteError(null);
    const r = await deleteAttributeAction(attribute.id);
    setDeletePending(false);
    if (r.error) setDeleteError(r.error);
    else setConfirmDelete(false);
  }

  return (
    <Card
      title={
        <div className="flex w-full items-center justify-between">
          <span>{attribute.name}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="grid size-7 place-items-center text-ink-60 hover:text-ink"
              aria-label="Editar"
            >
              <Icon name="edit" size={14} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="grid size-7 place-items-center text-ink-60 hover:text-sale"
              aria-label="Excluir"
            >
              <Icon name="trash" size={14} />
            </button>
          </div>
        </div>
      }
    >
      {editing && (
        <form action={editAction} className="mb-4 grid items-end gap-3 md:grid-cols-[1fr_140px_140px_auto]">
          <LabeledField label="Nome">
            <input type="text" name="name" defaultValue={attribute.name} required />
          </LabeledField>
          <LabeledField label="Slug">
            <input
              type="text"
              name="slug"
              defaultValue={attribute.slug}
              className="font-mono"
            />
          </LabeledField>
          <LabeledField label="Tipo">
            <select name="type" defaultValue={attribute.type}>
              <option value="SELECT">Lista</option>
              <option value="COLOR">Cor</option>
            </select>
          </LabeledField>
          <div className="flex gap-1">
            <Button type="submit" variant="primary" size="sm" disabled={editPending}>
              {editPending ? '…' : 'Salvar'}
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
          {editState.error && (
            <div className="md:col-span-4 text-eyebrow text-sale">{editState.error}</div>
          )}
        </form>
      )}

      <div className="mb-1 text-body-sm text-ink-60">
        <span className="font-mono">/{attribute.slug}</span> ·{' '}
        {attribute.type === 'COLOR' ? 'Cor (swatch hex)' : 'Lista'}
      </div>

      <ValuesList attribute={attribute} />

      <ConfirmModal
        open={confirmDelete}
        tone="danger"
        title={`Excluir o atributo "${attribute.name}"?`}
        description="Esta ação só funciona se nenhum produto estiver usando esse atributo."
        confirmLabel="Excluir"
        loading={deletePending}
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setConfirmDelete(false);
          setDeleteError(null);
        }}
      />
      {deleteError && (
        <div className="mt-2 text-eyebrow text-sale">{deleteError}</div>
      )}
    </Card>
  );
}

function ValuesList({ attribute }: { attribute: AdminAttribute }) {
  return (
    <div className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
      <div className="mb-1 text-eyebrow text-ink-60">Valores</div>
      {attribute.values.length === 0 ? (
        <div className="text-body-sm text-ink-60">Nenhum valor. Adicione abaixo.</div>
      ) : (
        attribute.values.map((v) => (
          <ValueRow key={v.id} attribute={attribute} value={v} />
        ))
      )}
      <CreateValueForm attribute={attribute} />
    </div>
  );
}

function ValueRow({
  attribute,
  value,
}: {
  attribute: AdminAttribute;
  value: AdminAttributeValue;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editState, editAction, editPending] = useActionState(
    updateAttributeValueAction.bind(null, attribute.id, value.id),
    INITIAL,
  );

  if (editState.ok && editing) {
    queueMicrotask(() => setEditing(false));
  }

  async function onConfirmDelete() {
    setDeletePending(true);
    setDeleteError(null);
    const r = await deleteAttributeValueAction(attribute.id, value.id);
    setDeletePending(false);
    if (r.error) setDeleteError(r.error);
    else setConfirmDelete(false);
  }

  if (editing) {
    return (
      <form
        action={editAction}
        className="grid items-end gap-2 md:grid-cols-[1fr_120px_100px_auto]"
      >
        <input name="name" type="text" defaultValue={value.name} required />
        <input
          name="slug"
          type="text"
          defaultValue={value.slug}
          className="font-mono"
        />
        {attribute.type === 'COLOR' ? (
          <ColorPicker name="hex" defaultValue={value.hex ?? ''} />
        ) : (
          <input type="hidden" name="hex" value="" />
        )}
        <div className="flex gap-1">
          <Button type="submit" variant="primary" size="sm" disabled={editPending}>
            {editPending ? '…' : 'Ok'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
          >
            X
          </Button>
        </div>
        {editState.error && (
          <div className="md:col-span-4 text-eyebrow text-sale">{editState.error}</div>
        )}
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2 text-body-sm">
      {attribute.type === 'COLOR' && (
        <span
          className="inline-block size-4 border border-line"
          style={{ backgroundColor: value.hex ?? '#ccc' }}
        />
      )}
      <span className="font-medium">{value.name}</span>
      <span className="font-mono text-eyebrow text-ink-60">/{value.slug}</span>
      <div className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="grid size-6 place-items-center text-ink-60 hover:text-ink"
        >
          <Icon name="edit" size={12} />
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="grid size-6 place-items-center text-ink-60 hover:text-sale"
        >
          <Icon name="trash" size={12} />
        </button>
      </div>
      <ConfirmModal
        open={confirmDelete}
        tone="danger"
        title={`Excluir "${value.name}"?`}
        description="Funciona se nenhuma variante de produto estiver usando esse valor."
        confirmLabel="Excluir"
        loading={deletePending}
        onConfirm={onConfirmDelete}
        onCancel={() => {
          setConfirmDelete(false);
          setDeleteError(null);
        }}
      />
      {deleteError && (
        <div className="ml-2 text-eyebrow text-sale">{deleteError}</div>
      )}
    </div>
  );
}

function CreateValueForm({ attribute }: { attribute: AdminAttribute }) {
  const [state, action, pending] = useActionState(
    createAttributeValueAction.bind(null, attribute.id),
    INITIAL,
  );
  const formRef = useRef<HTMLFormElement>(null);

  if (state.ok && formRef.current) {
    formRef.current.reset();
  }

  return (
    <form
      ref={formRef}
      action={action}
      className="mt-2 grid items-end gap-2 md:grid-cols-[1fr_120px_100px_auto]"
    >
      <input name="name" type="text" placeholder="Novo valor (ex: Azul)" />
      <input name="slug" type="text" placeholder="slug" className="font-mono" />
      {attribute.type === 'COLOR' ? (
        <ColorPicker name="hex" />
      ) : (
        <input type="hidden" name="hex" value="" />
      )}
      <Button type="submit" variant="secondary" size="sm" disabled={pending}>
        {pending ? '…' : '+ Add'}
      </Button>
      {state.error && (
        <div className="md:col-span-4 text-eyebrow text-sale">{state.error}</div>
      )}
    </form>
  );
}
