'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <section className="bg-cream py-24">
      <Container className="!max-w-[640px] text-center">
        <div className="flex flex-col items-center gap-5">
          <div className="eyebrow-hero">Mabruk Insider</div>
          <h2 className="font-display text-h2">Receba acesso antecipado</h2>
          <p className="text-body-md leading-relaxed text-ink-60">
            Novas coleções, edições limitadas e ofertas exclusivas. Comece com 10% off na
            primeira compra.
          </p>
          {done ? (
            <p className="mt-3 text-body-md text-success">
              Obrigada! Confira sua caixa de entrada para confirmar a inscrição.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-3 flex w-full max-w-[460px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="!flex-1 !border-r-0"
              />
              <Button type="submit" variant="primary" className="!rounded-none !px-7">
                Inscrever
              </Button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
