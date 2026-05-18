import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Icon } from '@/components/ui/icon';
import { ProductForm } from '@/components/admin/forms/product-form';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminCategories, getAdminProduct } from '@/lib/api/endpoints/admin';
import { ApiError } from '@/lib/api/client';
import type { ProductDetails } from '@/lib/api/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const isNew = id === 'novo';
  const categories = await listAdminCategories(token).catch(() => []);

  let product = null;
  if (!isNew) {
    try {
      const details = (await getAdminProduct(token, id)) as ProductDetails & {
        categoryId?: string;
      };
      const categoryId =
        (details as unknown as { categoryId: string }).categoryId ??
        categories.find((c) => c.slug === details.category.slug)?.id ??
        '';
      product = {
        id: details.id,
        slug: details.slug,
        name: details.name,
        description: details.description,
        status: details.status as 'DRAFT' | 'ACTIVE' | 'ARCHIVED',
        basePriceCents: details.basePriceCents,
        weightInGrams: details.weightInGrams,
        seoTitle: details.seoTitle,
        seoDescription: details.seoDescription,
        category: { id: categoryId },
        variants: details.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          banho: v.banho,
          size: v.size,
          priceCents: v.priceCents,
          stock: v.stock,
        })),
        images: details.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
        })),
      };
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 404) notFound();
      throw err;
    }
  }

  return (
    <>
      <AdminPageHeader
        subtitle={
          <span className="flex items-center gap-2">
            <Link href={'/admin/produtos' as Route} className="hover:text-ink">
              Produtos
            </Link>
            <Icon name="chevronRight" size={10} />
            <span>{isNew ? 'Novo' : 'Editar'}</span>
          </span>
        }
        title={product?.name ?? 'Novo produto'}
      />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
