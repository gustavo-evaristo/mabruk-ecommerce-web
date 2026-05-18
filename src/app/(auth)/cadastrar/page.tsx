'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AuthTabs } from '@/components/auth/auth-tabs';
import { signupAction, type AuthFormState } from '@/lib/auth/actions';

const INITIAL: AuthFormState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, INITIAL);

  return (
    <div className="w-full max-w-[460px]">
      <header className="mb-10 text-center">
        <div className="eyebrow-hero">Minha conta</div>
        <h1 className="mt-3 font-display text-[36px] leading-tight">
          Crie sua <span className="em-italic">conta</span>
        </h1>
        <p className="mt-3 text-body-sm leading-relaxed text-ink-60">
          Cadastre-se e ganhe 10% off na primeira compra
        </p>
      </header>

      <AuthTabs />

      <form action={formAction} className="flex flex-col gap-4">
        <Field label="Nome completo">
          <input
            type="text"
            name="name"
            required
            placeholder="Como aparece no documento"
          />
        </Field>
        <Field label="E-mail">
          <input type="email" name="email" required placeholder="seu@email.com" />
        </Field>
        <Field label="Telefone">
          <input type="tel" name="phone" placeholder="(11) 90000-0000" />
        </Field>
        <Field label="CPF/CNPJ">
          <input type="text" name="cpfCnpj" placeholder="Opcional, para emissão de NF" />
        </Field>
        <Field label="Senha" hint="Use letras, números e símbolos para uma senha forte">
          <input
            type="password"
            name="password"
            required
            placeholder="Mínimo 8 caracteres"
            minLength={8}
          />
        </Field>
        <Field label="Confirme a senha">
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Repita a senha"
            minLength={8}
          />
        </Field>

        <label className="flex items-start gap-2.5 text-body-xs leading-relaxed text-ink-60">
          <input type="checkbox" defaultChecked className="!w-auto !m-0 mt-1" />
          Quero receber novidades, lançamentos e ofertas exclusivas por e-mail
        </label>
        <label className="flex items-start gap-2.5 text-body-xs leading-relaxed text-ink-60">
          <input type="checkbox" required className="!w-auto !m-0 mt-1" />
          Li e aceito os <a className="text-ink underline">Termos de Uso</a> e a{' '}
          <a className="text-ink underline">Política de Privacidade</a>
        </label>

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
          {pending ? 'Criando conta…' : 'Criar conta e ganhar 10% off'}
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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-60">
        {label}
      </span>
      {children}
      {hint && <span className="text-body-xs text-ink-40">{hint}</span>}
    </label>
  );
}
