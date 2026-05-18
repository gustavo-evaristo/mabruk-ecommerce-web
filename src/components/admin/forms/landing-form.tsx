'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  deleteLandingAction,
  saveLandingAction,
  type ActionState,
} from '@/lib/auth/admin-extras-actions';
import type { AdminLanding } from '@/lib/api/endpoints/admin-extras';

const INITIAL: ActionState = {};

interface Props {
  landing: AdminLanding | null;
}

export function LandingForm({ landing }: Props) {
  const router = useRouter();
  const id = landing?.id ?? null;
  const [state, formAction, pending] = useActionState(
    saveLandingAction.bind(null, id),
    INITIAL,
  );

  if (state.ok && !id) {
    queueMicrotask(() => router.push('/admin/landings'));
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm('Excluir landing?')) return;
    await deleteLandingAction(id);
    router.push('/admin/landings');
  }

  return (
    <form action={formAction} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
      <div className="flex flex-col gap-4">
        <Card title="Informações">
          <div className="flex flex-col gap-4">
            <LabeledField label="Nome">
              <input type="text" name="name" defaultValue={landing?.name ?? ''} required />
            </LabeledField>
            <LabeledField label="Slug" optional>
              <input
                type="text"
                name="slug"
                defaultValue={landing?.slug ?? ''}
                className="font-mono"
                placeholder="revendedoras"
              />
            </LabeledField>
          </div>
        </Card>

        <Card title="Blocos (JSON)">
          <div className="text-eyebrow text-ink-60 mb-3">
            Edite os blocos como JSON. Cada bloco tem <code className="font-mono">id</code>,{' '}
            <code className="font-mono">type</code> e{' '}
            <code className="font-mono">props</code>. Tipos suportados: hero, benefits,
            steps, testimonials, faq, cta.
          </div>
          <textarea
            name="blocks"
            rows={20}
            className="font-mono !text-eyebrow"
            defaultValue={JSON.stringify(landing?.blocks ?? [], null, 2)}
          />
        </Card>

        <Card title="SEO">
          <div className="flex flex-col gap-4">
            <LabeledField label="Meta título" optional>
              <input type="text" name="seoTitle" defaultValue={landing?.seoTitle ?? ''} />
            </LabeledField>
            <LabeledField label="Meta descrição" optional>
              <textarea
                name="seoDescription"
                rows={3}
                defaultValue={landing?.seoDescription ?? ''}
              />
            </LabeledField>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card title="Publicação">
          <LabeledField label="Status">
            <select name="status" defaultValue={landing?.status ?? 'DRAFT'}>
              <option value="DRAFT">Rascunho</option>
              <option value="PUBLISHED">Publicada</option>
              <option value="ARCHIVED">Arquivada</option>
            </select>
          </LabeledField>
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
            {pending ? 'Salvando…' : id ? 'Salvar alterações' : 'Criar landing'}
          </Button>
          <Link href={'/admin/landings' as Route}>
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
              Excluir landing
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
