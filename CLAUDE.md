@AGENTS.md

# Mabruk Web

Frontend Next.js 16 da loja Mabruk Semijoias. Consome a API NestJS em `../api`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript estrito
- Tailwind CSS v4 (tokens em `globals.css` via `@theme`)
- React Query 5 (fluxos interativos — carrinho, checkout)
- Zod + react-hook-form (formulários)
- lucide-react (ícones)
- clsx + tailwind-merge (`cn` helper)

## Layout

- **Loja B2C** em `/` → catálogo, PDP, carrinho, checkout, conta
- **Painel B2B** em `/admin/*` → fase 3, não implementado ainda

## Convenções

1. **Server Components fazem o fetch**; Client Components recebem dados via props ou usam React Query para mutações.
2. **API client** em `src/lib/api/`: tipos em `types.ts`, fetch wrapper em `client.ts`, funções por recurso em `endpoints/*.ts`.
3. **Mock-first**: enquanto `USE_MOCK=true` (em `.env.local`), `endpoints/*.ts` retorna dados de `src/lib/mock/*.ts`. Trocar para `false` quando integrar com a API real.
4. **Money**: a API entrega `cents` (Int). Sempre usar `formatMoney(cents)` antes de exibir.
5. **Guest cart**: o cliente pode comprar sem cadastro. Guardamos `cartId` + `guestToken` em cookie HTTP-only (via Server Action) e enviamos no header `X-Cart-Token`.
6. **Auth**: JWT em cookie HTTP-only após login. Server Components leem o cookie e injetam `Authorization: Bearer <token>`.
7. **Variações de produto**: cada `ProductVariant` é a combinação `banho × size`. PDP renderiza dois seletores; busca a variant casando ambos.

## Comandos

```bash
pnpm install
pnpm dev          # http://localhost:3001  (API em 3000)
pnpm build
pnpm lint
pnpm format
```

## Próximos passos para integrar com API real

1. Subir a API: `cd ../api && pnpm dev`
2. Cadastrar conteúdo no painel admin via Swagger (`http://localhost:3000/api`)
3. Trocar `USE_MOCK=false` em `web/.env.local`
4. Reiniciar `pnpm dev` no frontend
