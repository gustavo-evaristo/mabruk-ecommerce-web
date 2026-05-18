import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminProducts } from '@/lib/api/endpoints/admin';

export const metadata: Metadata = { title: 'Produtos — Mabruk Admin' };

function stockBadge(stock: number) {
  if (stock === 0)
    return { label: 'Esgotado', className: 'bg-[rgba(140,58,46,0.08)] text-sale' };
  if (stock < 10)
    return {
      label: `Baixo · ${stock}`,
      className: 'bg-[rgba(168,148,111,0.12)] text-champagne-dark',
    };
  return {
    label: `${stock} em estoque`,
    className: 'bg-[rgba(61,106,78,0.08)] text-success',
  };
}

interface Props {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function ProductsListPage({ searchParams }: Props) {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const { search, status } = await searchParams;
  const { items, total } = await listAdminProducts(token, {
    search,
    status,
    pageSize: 50,
  }).catch(() => ({ items: [], total: 0 }));

  return (
    <>
      <AdminPageHeader
        subtitle="Catálogo"
        title="Produtos"
        action={
          <Link href={'/admin/produtos/novo/editar' as Route}>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              Novo produto
            </Button>
          </Link>
        }
      />

      <div className="p-6 lg:p-10">
        <div className="border border-line bg-paper">
          <div className="flex items-center gap-4 border-b border-line px-4 py-3.5">
            <div className="text-body-sm">
              <span className="font-medium">{total}</span>{' '}
              <span className="text-ink-60">
                {total === 1 ? 'produto' : 'produtos'}
              </span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="px-5 py-16 text-center text-body-sm text-ink-60">
              Nenhum produto cadastrado.
            </div>
          ) : (
            <>
              <div
                className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
                style={{ gridTemplateColumns: '60px 1fr 100px 120px 120px 40px' }}
              >
                <span />
                <span>Produto</span>
                <span className="text-right">Preço</span>
                <span>Estoque</span>
                <span>Status</span>
                <span />
              </div>

              {items.map((p) => {
                const sb = stockBadge(p.totalStock);
                return (
                  <Link
                    key={p.id}
                    href={`/admin/produtos/${p.id}/editar` as Route}
                    className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm hover:bg-cream/40 lg:gap-4 lg:grid-cols-[60px_1fr_100px_120px_120px_40px]"
                  >
                    <div className="size-12 bg-cream">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="size-12 object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="mt-0.5 font-mono text-eyebrow text-ink-60">
                        /{p.slug} · {p.category.name}
                      </div>
                    </div>
                    <span className="text-right font-mono">
                      {formatMoney(p.priceFromCents)}
                    </span>
                    <span
                      className={`inline-flex self-start px-2.5 py-1 text-[10px] tracking-wide ${sb.className}`}
                    >
                      {sb.label}
                    </span>
                    <span className="text-eyebrow text-ink-60">
                      {p.status === 'ACTIVE'
                        ? 'Publicado'
                        : p.status === 'DRAFT'
                          ? 'Rascunho'
                          : 'Arquivado'}
                    </span>
                    <Icon name="chevronRight" size={14} className="text-ink-60" />
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}
