'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import type { Route } from 'next';
import { Logo } from '@/components/layout/logo';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { adminLoginAction, type AdminAuthFormState } from '@/lib/auth/admin-actions';

const INITIAL: AdminAuthFormState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLoginAction, INITIAL);

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      {/* Esquerda — brand */}
      <div className="relative hidden flex-col justify-between bg-ink px-16 py-20 text-paper lg:flex">
        <div>
          <div className="invert">
            <Logo size={32} />
          </div>
          <div className="mt-1.5 text-eyebrow-sm font-medium uppercase tracking-eyebrow-xl text-paper/50">
            Painel administrativo
          </div>
        </div>

        <div>
          <h1 className="font-display text-[64px] leading-[0.95] font-normal">
            Bem-vinda
            <br />
            <span className="em-italic text-champagne">de volta</span>
          </h1>
          <p className="mt-6 max-w-[360px] text-body-md leading-relaxed text-paper/70">
            Acesse o painel para gerir pedidos, produtos e a operação da Mabruk em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-6 text-eyebrow text-paper/60">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="lock" size={12} /> Conexão SSL segura
          </span>
          <span>·</span>
          <span className="font-mono">v 1.3.0</span>
        </div>
      </div>

      {/* Direita — formulário */}
      <div className="flex flex-col justify-center bg-paper px-8 py-12 sm:px-16 sm:py-20">
        <div className="mx-auto w-full max-w-[480px]">
          <div className="flex items-center justify-between lg:hidden">
            <Logo size={28} />
            <Link href={'/' as Route} className="text-eyebrow underline text-ink-60">
              Ir para a loja
            </Link>
          </div>

          <div className="mt-10 lg:mt-0">
            <div className="text-eyebrow font-medium uppercase tracking-eyebrow-lg text-ink-60">
              Entrar
            </div>
            <h2 className="mt-3 font-display text-h3 font-normal lg:text-h2">Acessar painel</h2>
            <p className="mt-3 text-body-sm leading-relaxed text-ink-60">
              Use suas credenciais de administrador para entrar
            </p>
          </div>

          <form action={formAction} className="mt-9 flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-eyebrow-sm font-medium uppercase tracking-eyebrow text-ink-60"
              >
                E-mail corporativo
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="voce@mabruk.com.br"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-eyebrow-sm font-medium uppercase tracking-eyebrow text-ink-60"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="-mt-1 flex items-center justify-between">
              <label className="flex items-center gap-2 text-body-sm text-ink-60">
                <input type="checkbox" defaultChecked className="!w-auto !m-0" />
                Manter conectada
              </label>
              <Link
                href={'/admin/recuperar-senha' as Route}
                className="text-body-sm text-ink underline"
              >
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
              iconRight={<Icon name="arrowRight" size={14} />}
              className="mt-3"
            >
              {pending ? 'Entrando…' : 'Entrar no painel'}
            </Button>

            <div className="mt-4 flex items-start gap-3 bg-cream p-4 text-body-sm leading-relaxed text-ink-60">
              <Icon name="lock" size={14} className="mt-0.5 shrink-0" />
              <span>
                Acesso restrito à equipe Mabruk. Tentativas de login são registradas e
                monitoradas.
              </span>
            </div>
          </form>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-eyebrow text-ink-60">
            <span>
              Suporte técnico:{' '}
              <strong className="font-mono text-ink">ti@mabruk.com.br</strong>
            </span>
            <Link href={'/' as Route} className="text-ink underline hidden lg:inline">
              ← Ir para a loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
