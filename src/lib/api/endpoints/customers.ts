import { apiFetch } from '../client';
import type { Address, AuthResult, Customer } from '../types';

// --------- Auth ---------

export async function signupCustomer(body: {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResult> {
  return apiFetch<AuthResult>('/b2c/customers', { method: 'POST', body });
}

export async function loginCustomer(body: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  return apiFetch<AuthResult>('/b2c/customers/login', { method: 'POST', body });
}

// --------- Perfil ---------

export async function getCustomerMe(token: string): Promise<Customer> {
  return apiFetch<Customer>('/b2c/customers/me', { token });
}

export async function updateCustomerMe(
  token: string,
  body: { name?: string; phone?: string; cpfCnpj?: string },
): Promise<Customer> {
  return apiFetch<Customer>('/b2c/customers/me', { method: 'PATCH', body, token });
}

export async function changeCustomerPassword(
  token: string,
  body: { currentPassword: string; newPassword: string; confirmPassword: string },
): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>('/b2c/customers/me/change-password', {
    method: 'POST',
    body,
    token,
  });
}

// --------- Endereços ---------

export async function listMyAddresses(token: string): Promise<Address[]> {
  const res = await apiFetch<{ items: Address[] }>('/b2c/customers/me/addresses', { token });
  return res.items;
}

export type AddressInput = Omit<Address, 'id'>;

export async function createMyAddress(token: string, body: AddressInput): Promise<Address> {
  return apiFetch<Address>('/b2c/customers/me/addresses', { method: 'POST', body, token });
}

export async function updateMyAddress(
  token: string,
  id: string,
  body: Partial<AddressInput>,
): Promise<Address> {
  return apiFetch<Address>(`/b2c/customers/me/addresses/${id}`, { method: 'PATCH', body, token });
}

export async function deleteMyAddress(token: string, id: string): Promise<{ ok: true }> {
  return apiFetch<{ ok: true }>(`/b2c/customers/me/addresses/${id}`, {
    method: 'DELETE',
    token,
  });
}
