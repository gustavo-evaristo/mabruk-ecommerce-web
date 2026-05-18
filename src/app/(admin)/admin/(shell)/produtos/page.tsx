import Link from 'next/link';
import type { Route } from 'next';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { formatMoney } from '@/lib/utils/format';
import { ADMIN_PRODUCTS } from '@/lib/mock/admin';

export const metadata: Metadata = { title: 'Produtos — Mabruk Admin' };

const STATS = [
  { label: 'Produtos ativos', value: '142', sub: 'em 7 categorias' },
  { label: 'Esgotados', value: '3', sub: 'precisam de reposição' },
  { label: 'Estoque baixo', value: '8', sub: 'menos de 10 unidades' },
  { label: 'Valor total em estoque', value: 'R$ 184.520', sub: '1.247 unidades' },
];

const TABS = [
  { id: 'all', label: 'Todos', count: 148, active: true },
  { id: 'active', label: 'Ativos', count: 142 },
  { id: 'draft', label: 'Rascunhos', count: 4 },
  { id: 'archived', label: 'Arquivados', count: 2 },
  { id: 'low', label: 'Estoque baixo', count: 8 },
];

function stockBadge(stock: number) {
  if (stock === 0) {
    return {
      label: 'Esgotado',
      className: 'bg-[rgba(140,58,46,0.08)] text-sale',
    };
  }
  if (stock < 10) {
    return {
      label: `Baixo · ${stock}`,
      className: 'bg-[rgba(168,148,111,0.12)] text-champagne-dark',
    };
  }
  return {
    label: `${stock} em estoque`,
    className: 'bg-[rgba(61,106,78,0.08)] text-success',
  };
}

export default function ProductsListPage() {
  return (
    <>
      <AdminPageHeader
        subtitle="Catálogo"
        title="Produtos"
        action={
          <>
            <Button variant="secondary" size="md" icon={<Icon name="upload" size={14} />}>
              Importar CSV
            </Button>
            <Button variant="secondary" size="md">Exportar</Button>
            <Link href={'/admin/produtos/novo' as Route}>
              <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
                Novo produto
              </Button>
            </Link>
          </>
        }
      />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border border-line bg-paper px-6 py-4.5">
              <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">
                {s.label}
              </div>
              <div className="mt-1.5 font-display text-h4 font-normal">{s.value}</div>
              <div className="mt-0.5 text-eyebrow text-ink-60">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="border border-line bg-paper">
          <div className="flex flex-wrap items-center gap-4 border-b border-line px-4 py-3.5">
            <div className="flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`inline-flex items-center gap-2 px-3.5 py-2 text-body-sm ${
                    t.active
                      ? 'bg-cream font-medium text-ink'
                      : 'text-ink-60 hover:text-ink'
                  }`}
                >
                  {t.label}
                  <span className="font-mono text-[10px] text-ink-40">{t.count}</span>
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <select className="!h-9 !w-32 !py-1.5 !text-body-sm">
                <option>Categoria</option>
              </select>
              <select className="!h-9 !w-32 !py-1.5 !text-body-sm">
                <option>Coleção</option>
              </select>
              <Button variant="ghost" size="sm" icon={<Icon name="filter" size={14} />}>
                Mais filtros
              </Button>
            </div>
          </div>

          <div
            className="hidden items-center gap-4 border-b border-line bg-cream px-4 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
            style={{
              gridTemplateColumns: '32px 80px 1fr 120px 100px 120px 120px 100px 60px',
            }}
          >
            <input type="checkbox" className="!w-auto !m-0" />
            <span />
            <span>Produto</span>
            <span>SKU</span>
            <span className="text-right">Preço</span>
            <span>Estoque</span>
            <span>Categoria</span>
            <span className="text-right">Vendidos</span>
            <span />
          </div>

          {ADMIN_PRODUCTS.map((p) => {
            const sb = stockBadge(p.stock);
            return (
              <div
                key={p.id}
                className="grid items-center gap-3 border-b border-line px-4 py-3.5 text-body-sm lg:gap-4"
                style={{
                  gridTemplateColumns: '32px 80px 1fr 120px 100px 120px 120px 100px 60px',
                }}
              >
                <input type="checkbox" className="!w-auto !m-0" />
                <div className="h-[76px] w-16 bg-cream" />
                <div>
                  <div className="font-display text-[15px] leading-tight">{p.name}</div>
                  {p.collection && (
                    <div className="mt-0.5 text-[10px] uppercase tracking-wide text-ink-60">
                      {p.collection}
                    </div>
                  )}
                </div>
                <span className="font-mono text-eyebrow text-ink-60">{p.sku}</span>
                <div className="text-right">
                  <div className="font-mono">{formatMoney(p.price)}</div>
                </div>
                <span
                  className={`inline-flex self-start px-2.5 py-1 text-[10px] tracking-wide ${sb.className}`}
                >
                  {sb.label}
                </span>
                <span className="text-body-sm text-ink-80">{p.category}</span>
                <span className="text-right font-mono">{p.sales30d}</span>
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/admin/produtos/${p.id}/editar` as Route}
                    className="grid size-7 place-items-center text-ink-60 hover:text-ink"
                  >
                    <Icon name="edit" size={14} />
                  </Link>
                  <button
                    type="button"
                    className="grid size-7 place-items-center text-ink-60 hover:text-ink"
                  >
                    <Icon name="chevronDown" size={14} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-body-sm text-ink-60">
            <span>
              Exibindo <span className="font-mono">1–{ADMIN_PRODUCTS.length}</span> de{' '}
              <span className="font-mono">148</span> produtos
            </span>
            <div className="flex gap-1">
              <button type="button" className="border border-line px-2.5 py-1.5">
                <Icon name="arrowLeft" size={12} />
              </button>
              {[1, 2, 3, '…', 11].map((n, i) => (
                <button
                  key={i}
                  type="button"
                  className={`font-mono min-w-8 border px-2.5 py-1.5 ${
                    n === 1 ? 'border-ink bg-ink text-paper' : 'border-line text-ink'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button type="button" className="border border-line px-2.5 py-1.5">
                <Icon name="arrowRight" size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
