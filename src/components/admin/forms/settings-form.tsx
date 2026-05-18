'use client';

import { useActionState } from 'react';
import { Card, LabeledField, MoneyInput } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import {
  saveSettingsGroupAction,
  type ActionState,
} from '@/lib/auth/admin-extras-actions';

const INITIAL: ActionState = {};

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'money';
  optional?: boolean;
}

interface Props {
  group: string;
  title: string;
  fields: FieldDef[];
  values: Record<string, unknown>;
}

export function SettingsGroupForm({ group, title, fields, values }: Props) {
  const [state, formAction, pending] = useActionState(
    saveSettingsGroupAction.bind(null, group),
    INITIAL,
  );

  return (
    <Card title={title}>
      <form action={formAction} className="flex flex-col gap-4">
        {fields.map((f) => {
          const raw = values[f.key];
          return (
            <LabeledField key={f.key} label={f.label} optional={f.optional}>
              {f.type === 'textarea' ? (
                <textarea name={f.key} defaultValue={String(raw ?? '')} rows={3} />
              ) : f.type === 'money' ? (
                <MoneyInput
                  name={f.key}
                  initialCents={typeof raw === 'number' ? raw : Number(raw) || 0}
                />
              ) : (
                <input type={f.type} name={f.key} defaultValue={String(raw ?? '')} />
              )}
            </LabeledField>
          );
        })}

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

        <Button type="submit" variant="primary" size="md" disabled={pending}>
          {pending ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>
    </Card>
  );
}
