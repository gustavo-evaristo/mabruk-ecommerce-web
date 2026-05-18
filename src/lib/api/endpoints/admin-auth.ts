import { apiFetch } from '../client';

export interface AdminAuthResult {
  admin: { id: string; name: string; email: string; role: string };
  token: string;
}

export interface AdminMe {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function adminLogin(body: {
  email: string;
  password: string;
}): Promise<AdminAuthResult> {
  return apiFetch<AdminAuthResult>('/b2b/auth/login', {
    method: 'POST',
    body,
  });
}

export async function getAdminMe(token: string): Promise<AdminMe> {
  return apiFetch<AdminMe>('/b2b/auth/me', { token });
}

export async function changeAdminPassword(
  token: string,
  body: { currentPassword: string; newPassword: string; confirmPassword: string },
): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>('/b2b/auth/change-password', {
    method: 'POST',
    body,
    token,
  });
}
