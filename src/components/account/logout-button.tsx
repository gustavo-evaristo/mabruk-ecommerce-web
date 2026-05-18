'use client';

import { logoutAction } from '@/lib/auth/actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="cursor-pointer self-start border border-line px-4 py-2.5 text-eyebrow font-medium uppercase tracking-eyebrow hover:bg-ink hover:text-paper sm:self-auto"
      >
        Sair da conta
      </button>
    </form>
  );
}
