'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Icon, type IconName } from '@/components/ui/icon';
import { SectionHead } from '@/components/ui/section-head';

const RESELLER_FORM_URL = 'https://forms.google.com/seu-link-aqui';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1400&q=80';

const STATS = [
  { value: 'R$ 0', label: 'Investimento inicial' },
  { value: 'Até 45%', label: 'De comissão' },
  { value: 'Brasil', label: 'Atendemos todo o país' },
];

const BENEFITS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'pkg',
    title: 'Sem investimento inicial',
    desc: 'Você recebe o mostruário antes de qualquer pagamento. Paga apenas pelo que vender.',
  },
  {
    icon: 'dollar',
    title: 'Margem de 35% a 45%',
    desc: 'Margens generosas, com tabela de comissão que pode chegar a 45% conforme volume.',
  },
  {
    icon: 'truck',
    title: 'Frete grátis',
    desc: 'Acima do valor mínimo de pedido (passado no cadastro), todos os envios são por nossa conta.',
  },
  {
    icon: 'check',
    title: 'Troca de peças a cada 30 dias',
    desc: 'Sem peças paradas. Trocamos o mostruário em ciclos mensais sem custo.',
  },
  {
    icon: 'star',
    title: 'Treinamento contínuo',
    desc: 'Vídeos de venda, técnicas de foto e atendimento, e acompanhamento por WhatsApp.',
  },
  {
    icon: 'map',
    title: 'Atendemos todo o Brasil',
    desc: 'Você pode ser revendedora Mabruk em qualquer cidade brasileira. Enviamos para todo o país.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Cadastre-se',
    desc: 'Preencha o formulário com seus dados e perfil de venda. Nossa equipe avalia em até 48h.',
  },
  {
    n: '02',
    title: 'Receba o kit inicial',
    desc: 'Enviamos um mostruário inicial com cerca de 30 a 35 peças, em consignação. Você só paga pelo que vender.',
  },
  {
    n: '03',
    title: 'Comece a vender',
    desc: 'No dia a dia, com clientes próximas, em casa, nas redes sociais ou em eventos. Suporte por WhatsApp sempre que precisar.',
  },
  {
    n: '04',
    title: 'Monte seu próprio mostruário',
    desc: 'A partir do segundo mostruário você acessa o catálogo completo e escolhe livremente as peças que quer revender.',
  },
];

const PROFILES = [
  {
    name: 'Carolina M.',
    city: 'Curitiba · PR',
    quote:
      'Comecei vendendo entre amigas. A consignação me deu segurança para crescer no meu ritmo.',
    imageUrl:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Isabela R.',
    city: 'Recife · PE',
    quote:
      'A curadoria da Mabruk facilita muito. Vendo direto pelo Instagram, no horário que dá.',
    imageUrl:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Daniela T.',
    city: 'Belo Horizonte · MG',
    quote:
      'Trabalho em paralelo ao meu emprego. Virou uma renda extra muito bem-vinda.',
    imageUrl:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  },
];

const FAQS = [
  {
    q: 'Preciso ter MEI ou CNPJ?',
    a: 'Não é obrigatório no início. À medida que suas vendas crescem, recomendamos abrir um MEI — nosso time orienta gratuitamente.',
  },
  {
    q: 'Qual o tamanho do mostruário inicial?',
    a: 'O kit inicial tem cerca de 30 a 35 peças selecionadas pela Mabruk. A partir do segundo mostruário, você acessa o catálogo completo e monta sua própria seleção.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'No fim de cada mês você reporta as peças vendidas e paga apenas por elas. As peças não vendidas voltam ou são trocadas no ciclo mensal seguinte.',
  },
  {
    q: 'E o frete?',
    a: 'O frete é grátis para pedidos acima do valor mínimo combinado no seu cadastro. Abaixo disso, é dividido com você.',
  },
  {
    q: 'Recebo materiais para divulgar?',
    a: 'Sim. Você tem acesso a fotos profissionais, vídeos, templates para Instagram e Stories, além de catálogos digitais atualizados.',
  },
  {
    q: 'Tem treinamento?',
    a: 'Sim. Onboarding em encontros online + grupo de WhatsApp ativo, com dicas de venda, fotografia e atendimento.',
  },
];

export default function RevendedorasPage() {
  const [activeFaq, setActiveFaq] = useState<number>(-1);

  function scrollToHow() {
    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' });
  }

  function openForm() {
    window.open(RESELLER_FORM_URL, '_blank', 'noopener,noreferrer');
  }

  return (
    <>
      {/* HERO */}
      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-stretch md:grid-cols-[1fr_1.05fr]">
          <div className="flex flex-col justify-center gap-7 px-10 py-24 md:px-20">
            <div className="eyebrow-hero">Programa de consignação</div>
            <h1 className="font-display text-display-lg leading-tight tracking-tight">
              Seja uma
              <br />
              <span className="em-italic">revendedora</span>
              <br />
              Mabruk
            </h1>
            <p className="max-w-[480px] text-body-xl leading-relaxed text-ink-60">
              Construa sua própria renda vendendo as semijoias que já são desejo de tantas
              mulheres. Sem investimento inicial, sem estoque parado.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={openForm}
                iconRight={<Icon name="arrowRight" size={14} />}
              >
                Quero me cadastrar
              </Button>
              <Button
                variant="ghost"
                size="lg"
                iconRight={<Icon name="arrowRight" size={14} />}
                onClick={scrollToHow}
              >
                Como funciona
              </Button>
            </div>
            <div className="mt-6 flex gap-6 border-t border-ink/10 pt-8 md:gap-12">
              {STATS.map((s) => (
                <div key={s.label} className="min-w-0 flex-1">
                  <div className="font-display text-h3 leading-none">{s.value}</div>
                  <div className="eyebrow mt-2 whitespace-nowrap">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[480px] overflow-hidden md:min-h-[640px]">
            <Image
              src={HERO_IMAGE}
              alt="Modelo usando peças Mabruk"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute top-8 right-8 max-w-[260px] bg-paper/95 px-4 py-3 backdrop-blur-sm">
              <div className="eyebrow !text-ink-60">Enviamos para</div>
              <div className="mt-1 font-display text-h6">todo o Brasil</div>
              <div className="font-mono nums text-body-xs text-ink-80">via Correios</div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-paper py-24">
        <Container>
          <SectionHead
            eyebrow="Por que Mabruk"
            title="Tudo o que você precisa para começar"
          />
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex flex-col gap-3">
                <div className="grid size-11 place-items-center bg-cream">
                  <Icon name={b.icon} size={20} stroke={1.2} />
                </div>
                <h3 className="mt-1 font-display text-h6">{b.title}</h3>
                <p className="text-body-md leading-relaxed text-ink-60">{b.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="bg-ink py-24 text-paper">
        <Container>
          <div className="mb-16 grid items-start gap-20 md:grid-cols-[1fr_1.5fr]">
            <div>
              <div className="eyebrow-hero !text-paper/60">Como funciona</div>
              <h2 className="mt-4 font-display text-h1 leading-tight text-paper">
                Quatro passos
                <br />
                <span className="em-italic !text-paper">simples</span>
              </h2>
            </div>
            <p className="pt-3 text-body-lg leading-loose text-paper/75">
              Do cadastro à primeira venda em menos de 10 dias. Nosso modelo de consignação foi
              desenhado para reduzir riscos e dar autonomia para você crescer no seu ritmo — em
              casa, no salão de beleza, em eventos ou online pelas redes sociais.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="border-t border-paper/20 pt-8">
                <div className="mb-3.5 font-mono text-body text-champagne">{s.n}</div>
                <div className="mb-3 font-display text-h5 text-paper">{s.title}</div>
                <p className="text-body leading-relaxed text-paper/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PROFILES */}
      <section className="bg-cream py-24">
        <Container>
          <SectionHead
            eyebrow="Quem revende Mabruk"
            title="Histórias de quem caminha com a gente"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PROFILES.map((p) => (
              <article key={p.name} className="bg-paper">
                <div className="relative aspect-[4/3.4]">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <div className="font-display text-h6 italic font-light leading-relaxed text-ink-80">
                    “{p.quote}”
                  </div>
                  <div className="mt-6 border-t border-line pt-5">
                    <div className="text-body font-medium">{p.name}</div>
                    <div className="mt-1 text-body-xs text-ink-60">{p.city}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-paper py-24">
        <Container className="!max-w-[960px]">
          <div className="mb-14 text-center">
            <div className="eyebrow-hero">Perguntas frequentes</div>
            <h2 className="mt-3 font-display text-h2">Tudo o que você queria saber</h2>
          </div>
          <div>
            {FAQS.map((f, i) => {
              const open = activeFaq === i;
              return (
                <div key={f.q} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(open ? -1 : i)}
                    className="flex w-full items-center justify-between py-6 text-left"
                  >
                    <span className="font-display text-h6">{f.q}</span>
                    <Icon name={open ? 'minus' : 'plus'} size={18} stroke={1.2} />
                  </button>
                  {open && (
                    <div className="max-w-[720px] pb-6 text-body-md leading-loose text-ink-60">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FINAL CTA */}
      <section id="reseller-form" className="bg-cream py-32">
        <Container className="!max-w-[880px] text-center">
          <div className="eyebrow-hero">Próximo passo</div>
          <h2 className="mt-4 font-display text-display-sm leading-tight">
            Pronta para <span className="em-italic">começar?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[580px] text-body-xl leading-relaxed text-ink-60">
            Preencha nosso formulário rápido e nossa equipe entrará em contato em até 48h úteis
            para uma conversa sem compromisso.
          </p>
          <div className="mt-10">
            <Button
              variant="primary"
              size="lg"
              onClick={openForm}
              iconRight={<Icon name="arrowRight" size={16} />}
              className="!px-10 !py-5 !text-body"
            >
              Quero me cadastrar
            </Button>
          </div>
          <div className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-3 text-body text-ink-80">
            {[
              'Cadastro 100% sem compromisso',
              'Avaliação em até 48h úteis',
              'Atendimento humano por WhatsApp',
            ].map((label) => (
              <span key={label} className="inline-flex items-center gap-2.5">
                <Icon name="check" size={14} stroke={2} className="text-success" />
                {label}
              </span>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
