/**
 * Sessão admin separada do customer.
 * Cookie HTTP-only `mabruk_admin_token` validado pelo proxy de /admin/*.
 */
import 'server-only';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'mabruk_admin_token';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
  secure: process.env.NODE_ENV === 'production',
};

export async function setAdminToken(token: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, COOKIE_OPTIONS);
}

export async function getAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? null;
}

export async function clearAdminToken() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
