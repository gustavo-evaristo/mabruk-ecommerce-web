import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { AdminPageHeader } from '@/components/admin/shell';
import { Icon } from '@/components/ui/icon';
import { ReviewActions } from '@/components/admin/reviews/review-actions';
import { getAdminToken } from '@/lib/auth/admin-session';
import { listAdminReviews, type ReviewStatus } from '@/lib/api/endpoints/admin-extras';

export const metadata: Metadata = { title: 'Avaliações — Mabruk Admin' };

const STATUS_PILL: Record<ReviewStatus, string> = {
  PENDING: 'bg-[rgba(168,148,111,0.14)] text-champagne-dark',
  APPROVED: 'bg-[rgba(61,106,78,0.1)] text-success',
  REJECTED: 'bg-cream text-ink-60',
};

function stars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  searchParams: Promise<{ status?: ReviewStatus }>;
}

export default async function ReviewsPage({ searchParams }: Props) {
  const token = await getAdminToken();
  if (!token) redirect('/admin/entrar');

  const { status } = await searchParams;
  const items = await listAdminReviews(token, status).catch(() => []);

  return (
    <>
      <AdminPageHeader subtitle="Conteúdo" title="Avaliações" />

      <div className="p-6 lg:p-10">
        <div className="border border-line bg-paper">
          <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
            {(['PENDING', 'APPROVED', 'REJECTED'] as ReviewStatus[]).map((s) => (
              <a
                key={s}
                href={`/admin/avaliacoes?status=${s}`}
                className={`px-3 py-1.5 text-body-sm ${
                  status === s ? 'bg-cream font-medium' : 'text-ink-60 hover:text-ink'
                }`}
              >
                {s}
              </a>
            ))}
            <a
              href="/admin/avaliacoes"
              className={`px-3 py-1.5 text-body-sm ${
                !status ? 'bg-cream font-medium' : 'text-ink-60 hover:text-ink'
              }`}
            >
              Todas
            </a>
          </div>

          {items.length === 0 ? (
            <div className="px-5 py-16 text-center text-body-sm text-ink-60">
              Nenhuma avaliação.
            </div>
          ) : (
            items.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 border-b border-line p-5 last:border-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-body text-champagne-dark">
                      {stars(r.rating)}
                    </span>
                    <span
                      className={`inline-flex px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                        STATUS_PILL[r.status]
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <span className="text-eyebrow text-ink-60">{formatDate(r.createdAt)}</span>
                </div>
                {r.comment && (
                  <p className="text-body-sm leading-relaxed text-ink-80">{r.comment}</p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 text-eyebrow text-ink-60">
                  <span className="font-mono">
                    Cliente <span className="text-ink">{r.customerId.slice(0, 8)}</span> ·
                    Produto <span className="text-ink">{r.productId.slice(0, 8)}</span>
                  </span>
                  <ReviewActions id={r.id} status={r.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
