'use server';

import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { adminLogin } from '@/lib/api/endpoints/admin-auth';
import { setAdminToken, clearAdminToken } from './admin-session';

export interface AdminAuthFormState {
  error?: string;
}

function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

export async function adminLoginAction(
  _prev: AdminAuthFormState | undefined,
  formData: FormData,
): Promise<AdminAuthFormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Informe e-mail e senha.' };
  }

  try {
    const result = await adminLogin({ email, password });
    await setAdminToken(result.token);
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível entrar.') };
  }

  redirect('/admin');
}

export async function adminLogoutAction() {
  await clearAdminToken();
  redirect('/admin/entrar');
}
