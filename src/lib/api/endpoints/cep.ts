import { apiFetch } from '../client';
import type { CepLookupResult } from '../types';

export async function lookupCep(zipCode: string): Promise<CepLookupResult | null> {
  try {
    return await apiFetch<CepLookupResult>(`/b2c/cep/${zipCode.replace(/\D/g, '')}`);
  } catch {
    return null;
  }
}
