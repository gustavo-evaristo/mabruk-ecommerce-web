/**
 * Helpers server-side para gerenciar a sessão do cliente B2C.
 *
 * Armazena o JWT da API em cookie HTTP-only (`mabruk_token`). Server Components
 * leem via `getAuthToken()` e injetam em `apiFetch({ token })`.
 */
import 'server-only';
import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'mabruk_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  // 30 dias — mesmo expires_in do JWT da API
  maxAge: 60 * 60 * 24 * 30,
  secure: process.env.NODE_ENV === 'production',
};

export async function setAuthToken(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, COOKIE_OPTIONS);
}

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value ?? null;
}

export async function clearAuthToken() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getAuthToken()) !== null;
}
