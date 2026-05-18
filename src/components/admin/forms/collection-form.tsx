'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  deleteCollectionAction,
  saveCollectionAction,
  type ActionState,
} from '@/lib/auth/admin-catalog-actions';
import type { AdminCollection } from '@/lib/api/endpoints/admin';

const INITIAL: ActionState = {};

interface Props {
  collection: AdminCollection | null;
}

export function CollectionForm({ collection }: Props) {
  const router = useRouter();
  const id = collection?.id ?? null;
  const [state, formAction, pending] = useActionState(
    saveCollectionAction.bind(null, id),
    INITIAL,
  );

  if (state.ok && !id) {
    queueMicrotask(() => router.push('/admin/colecoes'));
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm('Tem certeza que quer excluir esta coleção?')) return;
    await deleteCollectionAction(id);
    router.push('/admin/colecoes');
  }

  return (
    <form action={formAction} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
      <div className="flex flex-col gap-4">
        <Card title="Informações básicas">
          <div className="flex flex-col gap-4">
            <LabeledField label="Nome da coleção">
              <input
                type="text"
                name="name"
                defaultValue={collection?.name ?? ''}
                required
                placeholder="Ex: Coleção Oásis"
              />
            </LabeledField>
            <LabeledField label="Slug (URL)" optional>
              <input
                type="text"
                name="slug"
                defaultValue={collection?.slug ?? ''}
                placeholder="auto-gerado se vazio"
                className="font-mono"
              />
            </LabeledField>
            <LabeledField label="Descrição">
              <textarea
                name="description"
                rows={5}
                defaultValue={collection?.description ?? ''}
                placeholder="Conte a história da coleção…"
              />
            </LabeledField>
          </div>
        </Card>

        <Card title="Capa">
          <LabeledField label="URL da imagem">
            <input
              type="url"
              name="coverImageUrl"
              defaultValue={collection?.coverImageUrl ?? ''}
              placeholder="https://..."
            />
          </LabeledField>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card title="Publicação">
          <label className="flex items-center gap-2.5 text-body-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={collection?.isActive ?? true}
              className="!w-auto !m-0"
            />
            Publicada
          </label>
          <div className="mt-1 text-eyebrow text-ink-60">
            Coleções não-publicadas não aparecem no site B2C.
          </div>
        </Card>

        {state.error && (
          <div className="border border-sale bg-[rgba(140,58,46,0.08)] px-3.5 py-2.5 text-body-sm text-sale">
            {state.error}
          </div>
        )}
        {state.ok && (
          <div className="border border-success bg-[rgba(61,106,78,0.08)] px-3.5 py-2.5 text-body-sm text-success">
            Salvo.
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button type="submit" variant="primary" disabled={pending} fullWidth>
            {pending ? 'Salvando…' : id ? 'Salvar alterações' : 'Criar coleção'}
          </Button>
          <Link href={'/admin/colecoes' as Route}>
            <Button type="button" variant="ghost" fullWidth>
              Cancelar
            </Button>
          </Link>
          {id && (
            <Button
              type="button"
              variant="danger"
              fullWidth
              onClick={onDelete}
              icon={<Icon name="trash" size={12} />}
              className="mt-3"
            >
              Excluir coleção
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
