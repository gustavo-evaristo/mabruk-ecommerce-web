/**
 * Formata centavos em moeda BRL: 14990 → "R$ 149,90"
 */
export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata CEP: 01310100 → "01310-100"
 */
export function formatCEP(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  if (digits.length !== 8) return cep;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Formata telefone BR: 11999999999 → "(11) 99999-9999"
 */
export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

/**
 * Calcula valor da parcela arredondado em centavos.
 * Útil para mostrar "ou 6x de R$ 24,98 sem juros"
 */
export function installmentValue(totalCents: number, installments: number): number {
  return Math.round(totalCents / installments);
}
