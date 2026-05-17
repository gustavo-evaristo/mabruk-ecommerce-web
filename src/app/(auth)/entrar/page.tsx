'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { AuthTabs } from '@/components/auth/auth-tabs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          Bem-vinda de <span className="em-italic">volta</span>
        </h1>
        <p className="mt-3 text-body-sm leading-relaxed text-ink-60">
          Entre para acompanhar pedidos e suas peças salvas
        </p>
      </header>

      <AuthTabs />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="E-mail">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </Field>
        <Field label="Senha">
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
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
        <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading} className="mt-3">
          {loading ? 'Entrando…' : 'Entrar'}
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
