'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AuthTabs } from '@/components/auth/auth-tabs';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/conta';
    }, 600);
  }

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

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Nome completo">
          <input type="text" required placeholder="Como aparece no documento" />
        </Field>
        <Field label="E-mail">
          <input type="email" required placeholder="seu@email.com" />
        </Field>
        <Field label="Telefone">
          <input type="tel" required placeholder="(11) 90000-0000" />
        </Field>
        <Field label="Senha" hint="Use letras, números e símbolos para uma senha forte">
          <input type="password" required placeholder="Mínimo 8 caracteres" />
        </Field>

        <label className="flex items-start gap-2.5 text-body-xs leading-relaxed text-ink-60">
          <input type="checkbox" defaultChecked className="!w-auto !m-0 mt-1" />
          Quero receber novidades, lançamentos e ofertas exclusivas por e-mail
        </label>
        <label className="flex items-start gap-2.5 text-body-xs leading-relaxed text-ink-60">
          <input type="checkbox" required className="!w-auto !m-0 mt-1" />
          Li e aceito os{' '}
          <a className="text-ink underline">Termos de Uso</a> e a{' '}
          <a className="text-ink underline">Política de Privacidade</a>
        </label>

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} className="mt-3">
          {loading ? 'Criando conta…' : 'Criar conta e ganhar 10% off'}
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
