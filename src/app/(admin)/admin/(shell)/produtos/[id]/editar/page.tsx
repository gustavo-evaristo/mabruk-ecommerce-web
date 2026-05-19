import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Route } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Icon } from '@/components/ui/icon';
import { ProductForm } from '@/components/admin/forms/product-form';
import { getAdminToken } from '@/lib/auth/admin-session';
import {
  listAdminCategories,
  listAdminTags,
  getAdminProduct,
  listAdminAttributes,
} from '@/lib/api/endpoints/admin';
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
  const [categories, tags, attributes] = await Promise.all([
    listAdminCategories(token).catch(() => []),
    listAdminTags(token).catch(() => []),
    listAdminAttributes(token).catch(() => []),
  ]);

  let product = null;
  if (!isNew) {
    try {
      const details = (await getAdminProduct(token, id)) as ProductDetails & {
        categoryId?: string;
        tags?: { id: string }[];
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
        type: details.type,
        basePriceCents: details.basePriceCents,
        sku: (details as unknown as { sku: string | null }).sku ?? null,
        priceCents: (details as unknown as { price: number | null }).price ?? null,
        stock: (details as unknown as { stock: number }).stock ?? 0,
        weightInGrams: details.weightInGrams,
        seoTitle: details.seoTitle,
        seoDescription: details.seoDescription,
        category: { id: categoryId },
        tagIds: details.tags?.map((t) => t.id) ?? [],
        attributes: details.attributes ?? [],
        variants: details.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          priceCents: v.priceCents,
          stock: v.stock,
          isDefault: v.isDefault,
          attributeValues: v.attributeValues,
        })),
        images: details.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          variantId: img.variantId,
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
      <ProductForm
        product={product}
        categories={categories}
        tags={tags}
        attributes={attributes}
      />
    </>
  );
}
