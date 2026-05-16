/**
 * Barra fina preta no topo do site com mensagem promocional.
 * Altura: 33px (parte do header total de 154px).
 */
export function TopBar() {
  return (
    <div className="flex h-[33px] items-center justify-center bg-ink px-4 text-paper">
      <p className="text-eyebrow-xs font-medium uppercase tracking-eyebrow-lg">
        Frete grátis acima de R$ 299 · até 2x sem juros
      </p>
    </div>
  );
}
