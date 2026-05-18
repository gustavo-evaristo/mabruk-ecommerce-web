'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  deleteBannerAction,
  saveBannerAction,
  type ActionState,
} from '@/lib/auth/admin-catalog-actions';
import type { AdminBanner } from '@/lib/api/endpoints/admin';

const INITIAL: ActionState = {};

interface Props {
  banner: AdminBanner | null;
}

function toDateInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 16);
}

export function BannerForm({ banner }: Props) {
  const router = useRouter();
  const id = banner?.id ?? null;
  const [state, formAction, pending] = useActionState(
    saveBannerAction.bind(null, id),
    INITIAL,
  );

  if (state.ok && !id) {
    queueMicrotask(() => router.push('/admin/banners'));
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm('Excluir este banner?')) return;
    await deleteBannerAction(id);
    router.push('/admin/banners');
  }

  return (
    <form action={formAction} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
      <div className="flex flex-col gap-4">
        <Card title="Imagens">
          <div className="flex flex-col gap-4">
            <LabeledField label="URL da imagem (desktop)">
              <input
                type="url"
                name="imageUrl"
                defaultValue={banner?.imageUrl ?? ''}
                required
                placeholder="https://..."
              />
            </LabeledField>
            <LabeledField label="URL da imagem mobile" optional>
              <input
                type="url"
                name="mobileImageUrl"
                defaultValue={banner?.mobileImageUrl ?? ''}
                placeholder="https://..."
              />
            </LabeledField>
            <LabeledField label="Texto alternativo (alt)">
              <input
                type="text"
                name="alt"
                defaultValue={banner?.alt ?? ''}
                placeholder="Descrição da imagem para acessibilidade"
              />
            </LabeledField>
          </div>
        </Card>

        <Card title="Link & Agendamento">
          <div className="flex flex-col gap-4">
            <LabeledField label="Link ao clicar" optional>
              <input
                type="text"
                name="linkUrl"
                defaultValue={banner?.linkUrl ?? ''}
                placeholder="/colecao/oasis"
                className="font-mono"
              />
            </LabeledField>
            <div className="grid grid-cols-2 gap-4">
              <LabeledField label="Início" optional>
                <input
                  type="datetime-local"
                  name="startsAt"
                  defaultValue={toDateInput(banner?.startsAt ?? null)}
                />
              </LabeledField>
              <LabeledField label="Fim" optional>
                <input
                  type="datetime-local"
                  name="endsAt"
                  defaultValue={toDateInput(banner?.endsAt ?? null)}
                />
              </LabeledField>
            </div>
            <LabeledField label="Ordem (menor = aparece primeiro)">
              <input
                type="number"
                name="order"
                defaultValue={banner?.order ?? 0}
                min={0}
                className="font-mono"
              />
            </LabeledField>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card title="Publicação">
          <label className="flex items-center gap-2.5 text-body-sm">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={banner?.isActive ?? true}
              className="!w-auto !m-0"
            />
            Ativo
          </label>
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
            {pending ? 'Salvando…' : id ? 'Salvar alterações' : 'Criar banner'}
          </Button>
          <Link href={'/admin/banners' as Route}>
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
              Excluir
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
