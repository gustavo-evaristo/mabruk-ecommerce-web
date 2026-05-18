import { redirect } from 'next/navigation';
import { getAuthToken } from '@/lib/auth/session';
import { listMyAddresses } from '@/lib/api/endpoints/customers';
import { AddressList } from '@/components/account/address-list';

export default async function EnderecosPage() {
  const token = await getAuthToken();
  if (!token) redirect('/entrar');

  const addresses = await listMyAddresses(token).catch(() => []);

  return <AddressList addresses={addresses} />;
}
