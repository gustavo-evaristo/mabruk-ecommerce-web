import { apiFetch, useMock } from '../client';
import type { CepLookupResult } from '../types';

export async function lookupCep(zipCode: string): Promise<CepLookupResult | null> {
  if (useMock()) {
    // mock: retorna São Paulo para qualquer CEP
    const digits = zipCode.replace(/\D/g, '');
    if (digits.length !== 8) return null;
    return {
      zipCode: digits,
      street: 'Avenida Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      complement: null,
    };
  }

  try {
    return await apiFetch<CepLookupResult>(`/b2c/cep/${zipCode.replace(/\D/g, '')}`);
  } catch {
    return null;
  }
}
