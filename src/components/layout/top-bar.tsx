/**
 * Barra fina preta no topo do site com mensagem promocional.
 * Altura: 33px (parte do header total de 154px).
 */
export function TopBar() {
  return (
    <div className="flex h-7 items-center justify-center bg-ink px-3 text-paper lg:h-[33px]">
      <p className="text-center text-[10px] font-medium uppercase tracking-eyebrow lg:text-eyebrow-xs lg:tracking-eyebrow-lg">
        Frete grátis acima de R$ 300,00 · até 6x sem juros
      </p>
    </div>
  );
}
