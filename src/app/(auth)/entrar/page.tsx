'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AuthTabs } from '@/components/auth/auth-tabs';
import { loginAction, type AuthFormState } from '@/lib/auth/actions';

const INITIAL: AuthFormState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <div className="w-full max-w-[460px]">
      <header className="mb-10 text-center">
        <div className="eyebrow-hero">Minha conta</div>
        <h1 className="mt-3 font-display text-[36px] leading-tight">
          Bem-vinda de <span className="em-italic">volta</span>
        </h1>
        <p className="mt-3 text-body-sm leading-relaxed text-ink-60">
          Entre para acompanhar pedidos e suas peças salvas
        </p>
      </header>

      <AuthTabs />

      <form action={formAction} className="flex flex-col gap-4">
        <Field label="E-mail">
          <input type="email" name="email" required placeholder="seu@email.com" />
        </Field>
        <Field label="Senha">
          <input type="password" name="password" required placeholder="••••••••" />
        </Field>
        <div className="-mt-1 flex items-center justify-between">
          <label className="flex items-center gap-2 text-body-xs text-ink-60">
            <input type="checkbox" defaultChecked className="!w-auto !m-0" />
            Manter conectada
          </label>
          <Link href={'/recuperar-senha' as Route} className="text-body-xs text-ink underline">
            Esqueci a senha
          </Link>
        </div>

        {state?.error && (
          <div className="border border-sale bg-[rgba(140,58,46,0.08)] px-3.5 py-2.5 text-body-sm text-sale">
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={pending}
          className="mt-3"
        >
          {pending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <div className="mt-10 flex justify-center gap-6 border-t border-line pt-6 text-body-xs text-ink-60">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="lock" size={12} /> Seguro · SSL
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon name="check" size={12} /> Dados protegidos
        </span>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
        {label}
      </span>
      {children}
    </label>
  );
}
