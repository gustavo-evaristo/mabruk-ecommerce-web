'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * QueryClient com defaults conservadores:
 *  - staleTime 30s — evita refetch agressivo após hydrate
 *  - gcTime 5min — mantém cache enquanto navega
 *  - retry 1 — não trava UI em falha transitória
 *  - refetchOnWindowFocus desligado — pra não recarregar listas a cada tab-switch
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

let browserClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: cliente novo a cada request (não compartilhar entre usuários)
    return makeQueryClient();
  }
  if (!browserClient) browserClient = makeQueryClient();
  return browserClient;
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(getQueryClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
