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
3. **API real para B2C**: catálogo (produtos, categorias, coleções, banners, tags) consome a API NestJS em `API_URL`. O painel B2B (`/admin/*`) ainda usa mocks em `src/lib/mock/admin.ts` até a próxima fase de integração.
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

## Próximos passos

1. Subir a API: `cd ../api && pnpm dev` (porta 3000)
2. Cadastrar conteúdo via Swagger em `http://localhost:3000/api` (categorias, coleções, produtos com variantes/imagens, banners)
3. `pnpm dev` no frontend (porta 3001)
4. **Pendente**: integrar painel B2B (`/admin/*`) com API — substituir mocks de `src/lib/mock/admin.ts`
