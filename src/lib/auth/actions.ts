'use server';

import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api/client';
import { loginCustomer, signupCustomer } from '@/lib/api/endpoints/customers';
import { setAuthToken, clearAuthToken } from './session';

export interface AuthFormState {
  error?: string;
}

function extractMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message || fallback;
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}

export async function loginAction(
  _prev: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Informe e-mail e senha.' };
  }

  try {
    const result = await loginCustomer({ email, password });
    await setAuthToken(result.token);
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível entrar.') };
  }

  redirect('/conta');
}

export async function signupAction(
  _prev: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim() || undefined;
  const cpfCnpj = String(formData.get('cpfCnpj') ?? '').trim() || undefined;
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!name || !email || !password || !confirmPassword) {
    return { error: 'Preencha todos os campos obrigatórios.' };
  }
  if (password !== confirmPassword) {
    return { error: 'As senhas não conferem.' };
  }

  try {
    const result = await signupCustomer({
      name,
      email,
      phone,
      cpfCnpj,
      password,
      confirmPassword,
    });
    await setAuthToken(result.token);
  } catch (err) {
    return { error: extractMessage(err, 'Não foi possível criar a conta.') };
  }

  redirect('/conta');
}

export async function logoutAction() {
  await clearAuthToken();
  redirect('/');
}
