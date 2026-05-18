'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/shell';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PromoBadge } from '@/components/admin/ui';
import { formatMoney } from '@/lib/utils/format';

type Section = 'campaigns' | 'coupons' | 'rules';

const STATS = [
  { label: 'Cupons ativos', value: '3', sub: '1 expira em 6 dias' },
  { label: 'Resgates no mês', value: '1.484', sub: 'R$ 187k em vendas atribuídas' },
  { label: 'Desconto concedido', value: 'R$ 24.380', sub: '13% das vendas no mês' },
  { label: 'Ticket médio com cupom', value: 'R$ 287', sub: '↓ 7% vs sem cupom' },
];

const CAMPAIGNS = [
  { name: 'Dia das Mães · Coleção Oásis', period: '03 a 15 mai', discount: '20% off', sales: 64, revenue: 1388000, status: 'expirado' as const },
  { name: 'Primeira Compra · Newsletter', period: 'Sempre ativo', discount: '10% off', sales: 384, revenue: 8924000, status: 'ativo' as const },
  { name: 'Black Friday · 2026', period: '24 a 30 nov', discount: 'Até 40%', sales: 0, revenue: 0, status: 'agendado' as const },
];

const COUPONS = [
  { code: 'PRIMEIRA10', type: '10% off', scope: 'Primeira compra', uses: 384, max: '∞', expires: '31/12/2026', status: 'ativo' as const },
  { code: 'MAES26', type: '20% off', scope: 'Coleção Oásis', uses: 142, max: 500, expires: '15/05/2026', status: 'expirado' as const },
  { code: 'INSIDER15', type: '15% off', scope: 'Clientes Insider', uses: 67, max: 200, expires: '30/06/2026', status: 'ativo' as const },
  { code: 'FRETEGRATIS', type: 'Frete grátis', scope: 'Acima R$ 199', uses: 891, max: '∞', expires: 'sem prazo', status: 'ativo' as const },
  { code: 'BLACK40', type: '40% off', scope: 'Toda a loja', uses: 0, max: 1000, expires: '29/11/2026', status: 'agendado' as const },
];

const RULES = [
  { name: 'Frete grátis acima de R$ 299', active: true, desc: 'Aplica automaticamente para todos os pedidos elegíveis. Exclui coleção Celeste.' },
  { name: 'PIX com 10% off', active: true, desc: 'Desconto à vista de 10% aplicado no checkout quando PIX é selecionado.' },
  { name: 'Brinde para pedidos acima de R$ 500', active: false, desc: 'Adiciona pulseira mini grátis ao carrinho. Pausado por falta de estoque.' },
  { name: 'Aniversariantes do mês: 15% off', active: true, desc: 'Cupom único enviado por e-mail aos clientes que fazem aniversário no mês.' },
];

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'campaigns', label: 'Campanhas' },
  { id: 'coupons', label: 'Cupons' },
  { id: 'rules', label: 'Regras automáticas' },
];

function Toggle({ active }: { active: boolean }) {
  return (
    <span
      className={`relative inline-block h-5 w-9 cursor-pointer rounded-full ${
        active ? 'bg-success' : 'bg-ink-20'
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-paper transition-all ${
          active ? 'left-4.5' : 'left-0.5'
        }`}
      />
    </span>
  );
}

export default function PromotionsPage() {
  const [section, setSection] = useState<Section>('campaigns');

  return (
    <>
      <AdminPageHeader
        subtitle="Marketing"
        title="Promoções e cupons"
        action={
          <>
            <Button variant="secondary" size="md">
              {section === 'coupons' ? 'Importar cupons' : 'Ver calendário'}
            </Button>
            <Button variant="primary" size="md" icon={<Icon name="plus" size={14} />}>
              {section === 'coupons' ? 'Novo cupom' : 'Nova campanha'}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6 p-6 lg:p-10">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border border-line bg-paper px-5 py-4.5">
              <div className="text-[10px] font-medium uppercase tracking-eyebrow text-ink-60">
                {s.label}
              </div>
              <div className="mt-1.5 font-display text-h4 font-normal">{s.value}</div>
              <div className="mt-0.5 text-eyebrow text-ink-60">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="flex w-fit gap-1 border border-line bg-paper p-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`px-4.5 py-2.5 text-body-sm tracking-wide ${
                section === s.id
                  ? 'bg-ink font-medium text-paper'
                  : 'text-ink-60 hover:text-ink'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {section === 'campaigns' && (
          <div className="border border-line bg-paper">
            <div
              className="hidden items-center gap-3 border-b border-line bg-cream px-5 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
              style={{
                gridTemplateColumns: '40px 1.6fr 1fr 120px 100px 120px 120px 40px',
              }}
            >
              <input type="checkbox" className="!w-auto !m-0" />
              <span>Campanha</span>
              <span>Período</span>
              <span>Desconto</span>
              <span className="text-right">Vendas</span>
              <span className="text-right">Receita</span>
              <span>Status</span>
              <span />
            </div>
            {CAMPAIGNS.map((c) => (
              <div
                key={c.name}
                className="grid items-center gap-3 border-b border-line px-5 py-4 text-body-sm"
                style={{
                  gridTemplateColumns: '40px 1.6fr 1fr 120px 100px 120px 120px 40px',
                }}
              >
                <input type="checkbox" className="!w-auto !m-0" />
                <div className="font-display text-[16px]">{c.name}</div>
                <span className="text-body-sm text-ink-60">{c.period}</span>
                <span className="font-medium">{c.discount}</span>
                <span className="text-right font-mono">{c.sales || '—'}</span>
                <span className="text-right font-mono font-medium">
                  {c.revenue ? formatMoney(c.revenue) : '—'}
                </span>
                <PromoBadge status={c.status} />
                <Icon name="chevronRight" size={14} className="text-ink-60" />
              </div>
            ))}
          </div>
        )}

        {section === 'coupons' && (
          <div className="border border-line bg-paper">
            <div
              className="hidden items-center gap-3 border-b border-line bg-cream px-5 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ink-60 lg:grid"
              style={{
                gridTemplateColumns:
                  '40px 1.2fr 80px 1fr 100px 100px 120px 120px 40px',
              }}
            >
              <input type="checkbox" className="!w-auto !m-0" />
              <span>Código</span>
              <span>Tipo</span>
              <span>Escopo</span>
              <span className="text-right">Usos</span>
              <span className="text-right">Máx.</span>
              <span>Validade</span>
              <span>Status</span>
              <span />
            </div>
            {COUPONS.map((c) => (
              <div
                key={c.code}
                className="grid items-center gap-3 border-b border-line px-5 py-4 text-body-sm"
                style={{
                  gridTemplateColumns:
                    '40px 1.2fr 80px 1fr 100px 100px 120px 120px 40px',
                }}
              >
                <input type="checkbox" className="!w-auto !m-0" />
                <span className="font-mono inline-flex self-start bg-cream px-2.5 py-1 text-body-sm font-semibold">
                  {c.code}
                </span>
                <span className="font-medium">{c.type}</span>
                <span className="text-body-sm text-ink-60">{c.scope}</span>
                <span className="text-right font-mono">{c.uses}</span>
                <span className="text-right font-mono text-ink-60">{c.max}</span>
                <span className="text-eyebrow text-ink-60">{c.expires}</span>
                <PromoBadge status={c.status} />
                <Icon name="chevronRight" size={14} className="text-ink-60" />
              </div>
            ))}
          </div>
        )}

        {section === 'rules' && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {RULES.map((r) => (
              <div key={r.name} className="border border-line bg-paper p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="font-display text-h6 font-normal">{r.name}</div>
                  <Toggle active={r.active} />
                </div>
                <p className="text-body leading-relaxed text-ink-60">{r.desc}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-eyebrow uppercase tracking-eyebrow">
                  <span className={r.active ? 'text-success' : 'text-ink-60'}>
                    {r.active ? '● Ativa' : '○ Pausada'}
                  </span>
                  <button type="button" className="text-ink underline">
                    Editar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
