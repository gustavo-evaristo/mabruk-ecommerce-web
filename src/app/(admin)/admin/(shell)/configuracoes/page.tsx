'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/shell';
import { Card, LabeledField } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';

type Tab =
  | 'store'
  | 'shipping'
  | 'payment'
  | 'taxes'
  | 'emails'
  | 'team'
  | 'integrations';

const TABS: { id: Tab; icon: IconName; label: string }[] = [
  { id: 'store', icon: 'home', label: 'Dados da loja' },
  { id: 'shipping', icon: 'truck', label: 'Frete' },
  { id: 'payment', icon: 'creditCard', label: 'Pagamento' },
  { id: 'taxes', icon: 'dollar', label: 'Impostos & NF' },
  { id: 'emails', icon: 'bell', label: 'E-mails' },
  { id: 'team', icon: 'users', label: 'Equipe' },
  { id: 'integrations', icon: 'box', label: 'Integrações' },
];

function Toggle({ active }: { active: boolean }) {
  return (
    <span
      className={`relative inline-block h-5 w-9 rounded-full ${
        active ? 'bg-success' : 'bg-ink-20'
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-paper ${
          active ? 'left-4.5' : 'left-0.5'
        }`}
      />
    </span>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('store');

  return (
    <>
      <AdminPageHeader subtitle="Sistema" title="Configurações" />

      <div className="grid gap-6 p-6 lg:grid-cols-[240px_1fr] lg:gap-8 lg:p-10">
        <aside>
          <div className="flex flex-col gap-0.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-left text-body ${
                  tab === t.id
                    ? 'bg-ink font-medium text-paper'
                    : 'text-ink-80 hover:bg-cream'
                }`}
              >
                <Icon name={t.icon} size={15} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="flex max-w-[880px] flex-col gap-4">
          {tab === 'store' && (
            <>
              <Card title="Identidade da loja">
                <div className="flex flex-col gap-4">
                  <LabeledField label="Nome da loja">
                    <input defaultValue="Mabruk Semijoias" />
                  </LabeledField>
                  <LabeledField label="Slogan">
                    <input defaultValue="O brilho que permanece" />
                  </LabeledField>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <LabeledField label="E-mail de contato">
                      <input type="email" defaultValue="atendimento@mabruk.com.br" />
                    </LabeledField>
                    <LabeledField label="WhatsApp">
                      <input type="tel" defaultValue="(11) 99999-9999" />
                    </LabeledField>
                  </div>
                  <LabeledField label="Instagram">
                    <input defaultValue="@mabruksemijoias" />
                  </LabeledField>
                </div>
              </Card>
              <Card title="Dados fiscais">
                <div className="flex flex-col gap-4">
                  <LabeledField label="Razão social">
                    <input defaultValue="Mabruk Comércio de Semijoias LTDA" />
                  </LabeledField>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <LabeledField label="CNPJ">
                      <input defaultValue="00.000.000/0001-00" />
                    </LabeledField>
                    <LabeledField label="Inscrição estadual">
                      <input defaultValue="123.456.789.000" />
                    </LabeledField>
                  </div>
                  <LabeledField label="Endereço comercial">
                    <input defaultValue="R. Oscar Freire, 1024 · Jardins, São Paulo · SP · 01426-000" />
                  </LabeledField>
                </div>
              </Card>
            </>
          )}

          {tab === 'shipping' && (
            <>
              <Card title="Política de frete">
                <div className="flex flex-col gap-3.5">
                  {[
                    { label: 'Frete grátis acima de R$ 299', checked: true },
                    {
                      label: 'Calcular frete por CEP automaticamente (Melhor Envio)',
                      checked: true,
                    },
                    { label: 'Permitir retirada na loja (Oscar Freire)', checked: true },
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      className="flex items-center gap-3 text-body-sm"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={opt.checked}
                        className="!w-auto !m-0"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </Card>
              <Card title="Modalidades disponíveis">
                <div>
                  {[
                    { name: 'PAC', days: '6-9 dias úteis', rule: 'Tabela Melhor Envio', active: true },
                    { name: 'SEDEX', days: '2-4 dias úteis', rule: 'Tabela Melhor Envio', active: true },
                    { name: 'Expressa', days: '1 dia útil · capital', rule: 'R$ 49,90 fixo', active: true },
                  ].map((m, i) => (
                    <div
                      key={m.name}
                      className={`grid items-center gap-4 py-3.5 ${
                        i < 2 ? 'border-b border-line' : ''
                      }`}
                      style={{ gridTemplateColumns: '1fr 1fr 1fr 60px' }}
                    >
                      <span className="text-body-md font-medium">{m.name}</span>
                      <span className="text-body-sm text-ink-60">{m.days}</span>
                      <span className="font-mono text-body-sm">{m.rule}</span>
                      <Toggle active={m.active} />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {tab === 'payment' && (
            <Card title="Métodos de pagamento">
              <div className="flex flex-col gap-4">
                {[
                  { name: 'PIX (Mercado Pago)', desc: 'Aprovação instantânea · 10% off à vista', active: true },
                  { name: 'Cartão de crédito (Mercado Pago)', desc: 'Até 6x sem juros · MasterCard, Visa, Elo', active: true },
                  { name: 'Boleto bancário', desc: 'Vencimento em 3 dias úteis', active: false },
                ].map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between border border-line p-4"
                  >
                    <div>
                      <div className="text-body font-medium">{m.name}</div>
                      <div className="mt-0.5 text-eyebrow text-ink-60">{m.desc}</div>
                    </div>
                    <Toggle active={m.active} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'taxes' && (
            <Card title="Notas fiscais">
              <div className="flex flex-col gap-4">
                <LabeledField label="Emissor de NF-e">
                  <select defaultValue="manual">
                    <option value="manual">Emissão manual (fora da plataforma)</option>
                    <option value="focusnfe">Focus NFe (automático)</option>
                  </select>
                </LabeledField>
                <LabeledField label="Regime tributário">
                  <select defaultValue="simples">
                    <option value="simples">Simples Nacional</option>
                    <option value="lucro">Lucro Presumido</option>
                  </select>
                </LabeledField>
                <LabeledField label="CFOP padrão">
                  <input defaultValue="5102" />
                </LabeledField>
              </div>
            </Card>
          )}

          {tab === 'emails' && (
            <Card title="Templates transacionais">
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Pedido recebido', desc: 'Disparado após criação do pedido', active: true },
                  { name: 'Pagamento confirmado', desc: 'Após webhook do Mercado Pago', active: true },
                  { name: 'Pedido enviado', desc: 'Com código de rastreio', active: true },
                  { name: 'Pedido entregue', desc: 'Solicita avaliação', active: true },
                  { name: 'Recuperação de carrinho', desc: '24h após abandono', active: false },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between border border-line p-4"
                  >
                    <div>
                      <div className="text-body font-medium">{t.name}</div>
                      <div className="mt-0.5 text-eyebrow text-ink-60">{t.desc}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button type="button" className="text-eyebrow underline">
                        Editar template
                      </button>
                      <Toggle active={t.active} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'team' && (
            <Card
              title="Membros da equipe"
              action={
                <Button variant="primary" size="sm" icon={<Icon name="plus" size={12} />}>
                  Convidar
                </Button>
              }
            >
              {[
                { name: 'Mariana Aragão', email: 'mariana@mabruk.com.br', role: 'Admin' },
                { name: 'Lucas Brandão', email: 'lucas@mabruk.com.br', role: 'Logística' },
                { name: 'Renata Cunha', email: 'renata@mabruk.com.br', role: 'Atendimento' },
              ].map((m, i, arr) => (
                <div
                  key={m.email}
                  className={`grid items-center gap-4 py-3.5 ${
                    i < arr.length - 1 ? 'border-b border-line' : ''
                  }`}
                  style={{ gridTemplateColumns: '40px 1fr 200px 120px 60px' }}
                >
                  <div className="grid size-9 place-items-center rounded-full bg-cream text-eyebrow font-semibold">
                    {m.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-eyebrow text-ink-60">{m.email}</div>
                  </div>
                  <select defaultValue={m.role}>
                    <option>Admin</option>
                    <option>Financeiro</option>
                    <option>Logística</option>
                    <option>Atendimento</option>
                  </select>
                  <span className="text-eyebrow text-success">● Ativo</span>
                  <button type="button" className="text-ink-60">
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </Card>
          )}

          {tab === 'integrations' && (
            <Card title="Integrações ativas">
              {[
                { name: 'Mercado Pago', desc: 'Gateway de pagamento', connected: true },
                { name: 'Melhor Envio', desc: 'Cálculo de frete e etiquetas', connected: true },
                { name: 'SendGrid', desc: 'E-mails transacionais', connected: true },
                { name: 'Supabase Storage', desc: 'Armazenamento de imagens', connected: true },
                { name: 'Google Analytics 4', desc: 'Métricas e funil', connected: false },
                { name: 'Meta Pixel', desc: 'Conversões Facebook/Instagram', connected: false },
              ].map((i, idx, arr) => (
                <div
                  key={i.name}
                  className={`flex items-center justify-between py-4 ${
                    idx < arr.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <div>
                    <div className="text-body font-medium">{i.name}</div>
                    <div className="mt-0.5 text-eyebrow text-ink-60">{i.desc}</div>
                  </div>
                  <Button
                    variant={i.connected ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    {i.connected ? 'Conectado · Desconectar' : 'Conectar'}
                  </Button>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
