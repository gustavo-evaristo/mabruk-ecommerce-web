'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  deletePromotionAction,
  savePromotionAction,
  type ActionState,
} from '@/lib/auth/admin-extras-actions';
import type { AdminPromotion } from '@/lib/api/endpoints/admin-extras';

const INITIAL: ActionState = {};

function toDateInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 16);
}

interface Props {
  promotion: AdminPromotion | null;
}

export function PromotionForm({ promotion }: Props) {
  const router = useRouter();
  const id = promotion?.id ?? null;
  const [state, formAction, pending] = useActionState(
    savePromotionAction.bind(null, id),
    INITIAL,
  );

  if (state.ok && !id) {
    queueMicrotask(() => router.push('/admin/promocoes'));
  }

  async function onDelete() {
    if (!id) return;
    if (!confirm('Excluir esta promoção?')) return;
    await deletePromotionAction(id);
    router.push('/admin/promocoes');
  }

  return (
    <form action={formAction} className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-10">
      <div className="flex flex-col gap-4">
        <Card title="Informações">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <LabeledField label="Tipo">
                <select name="type" defaultValue={promotion?.type ?? 'COUPON'} required>
                  <option value="COUPON">Cupom</option>
                  <option value="CAMPAIGN">Campanha</option>
                  <option value="RULE">Regra automática</option>
                </select>
              </LabeledField>
              <LabeledField label="Status">
                <select name="status" defaultValue={promotion?.status ?? 'ACTIVE'}>
                  <option value="ACTIVE">Ativo</option>
                  <option value="SCHEDULED">Agendado</option>
                  <option value="EXPIRED">Expirado</option>
                  <option value="PAUSED">Pausado</option>
                </select>
              </LabeledField>
            </div>
            <LabeledField label="Nome">
              <input type="text" name="name" defaultValue={promotion?.name ?? ''} required />
            </LabeledField>
            <LabeledField label="Código (cupom)" optional>
              <input
                type="text"
                name="code"
                defaultValue={promotion?.code ?? ''}
                className="font-mono uppercase"
                placeholder="MAES26"
              />
            </LabeledField>
            <LabeledField label="Descrição" optional>
              <textarea
                name="description"
                rows={3}
                defaultValue={promotion?.description ?? ''}
              />
            </LabeledField>
          </div>
        </Card>

        <Card title="Desconto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <LabeledField label="Tipo de desconto">
              <select
                name="discountType"
                defaultValue={promotion?.discountType ?? 'PERCENT'}
                required
              >
                <option value="PERCENT">Percentual (%)</option>
                <option value="FIXED_CENTS">Fixo (centavos)</option>
                <option value="FREE_SHIPPING">Frete grátis</option>
              </select>
            </LabeledField>
            <LabeledField label="Valor">
              <input
                type="number"
                name="discountValue"
                defaultValue={promotion?.discountValue ?? 0}
                min={0}
                className="font-mono"
              />
            </LabeledField>
          </div>
          <LabeledField label="Escopo">
            <input
              type="text"
              name="scope"
              defaultValue={promotion?.scope ?? 'all'}
              className="font-mono"
              placeholder="all, collection:oasis, category:colares"
            />
          </LabeledField>
        </Card>

        <Card title="Limites & Período">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <LabeledField label="Usos máximos" optional>
              <input
                type="number"
                name="usesMax"
                defaultValue={promotion?.usesMax ?? ''}
                min={0}
                className="font-mono"
              />
            </LabeledField>
            <LabeledField label="Usos atuais">
              <input
                type="text"
                defaultValue={String(promotion?.usesCount ?? 0)}
                disabled
                className="font-mono"
              />
            </LabeledField>
            <LabeledField label="Início" optional>
              <input
                type="datetime-local"
                name="startsAt"
                defaultValue={toDateInput(promotion?.startsAt ?? null)}
              />
            </LabeledField>
            <LabeledField label="Fim" optional>
              <input
                type="datetime-local"
                name="expiresAt"
                defaultValue={toDateInput(promotion?.expiresAt ?? null)}
              />
            </LabeledField>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
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
            {pending ? 'Salvando…' : id ? 'Salvar alterações' : 'Criar'}
          </Button>
          <Link href={'/admin/promocoes' as Route}>
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
