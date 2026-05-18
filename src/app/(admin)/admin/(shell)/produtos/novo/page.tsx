import { redirect } from 'next/navigation';

export default function NewProductPage() {
  redirect('/admin/produtos/p-001/editar');
}
