/**
 * Fetch wrapper para a API Mabruk (NestJS em `../api`).
 *
 * Lê base URL de:
 * - `API_URL` (server-side — Server Components, Server Actions, Route Handlers)
 * - `NEXT_PUBLIC_API_URL` (client-side)
 *
 * Pode receber headers extras por chamada (Authorization, X-Cart-Token).
 * No futuro, Server Components vão ler cookies HTTP-only e injetar esses
 * headers automaticamente — por enquanto, quem chama passa explícito.
 */

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly body: ApiErrorBody | null;

  constructor(statusCode: number, message: string, body: ApiErrorBody | null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.body = body;
  }
}

function resolveBaseUrl(): string {
  // Server: prefere API_URL; client: usa NEXT_PUBLIC_API_URL
  if (typeof window === 'undefined') {
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string; // JWT do cliente ou admin
  cartToken?: string; // X-Cart-Token (guest cart)
  query?: Record<string, string | number | boolean | undefined | null>;
  /**
   * Estratégia de cache do fetch do Next.
   * - 'no-store' → sempre fresh (default para POST/PATCH/etc)
   * - { revalidate: N } → ISR
   * - 'force-cache' → cache permanente
   */
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

function buildQuery(query?: RequestOptions['query']): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue;
    params.append(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : '';
}

export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const baseUrl = resolveBaseUrl();
  const url = `${baseUrl}${path}${buildQuery(opts.query)}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...opts.headers,
  };

  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.cartToken) headers['X-Cart-Token'] = opts.cartToken;

  const isJsonBody = opts.body !== undefined && !(opts.body instanceof FormData);
  if (isJsonBody) headers['Content-Type'] = 'application/json';

  const method = opts.method ?? (opts.body !== undefined ? 'POST' : 'GET');

  // Se o caller passa `next: { revalidate }`, deixa o Next gerenciar cache.
  // Caso contrário, default é `no-store` (mutations e leituras frescas).
  const cache = opts.cache ?? (opts.next?.revalidate !== undefined ? undefined : 'no-store');

  const res = await fetch(url, {
    method,
    headers,
    body:
      opts.body === undefined
        ? undefined
        : opts.body instanceof FormData
          ? (opts.body as FormData)
          : JSON.stringify(opts.body),
    cache,
    next: opts.next,
  });

  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      /* sem corpo JSON */
    }
    const msg = Array.isArray(body?.message)
      ? body!.message.join('; ')
      : body?.message || `${res.status} ${res.statusText}`;
    throw new ApiError(res.status, msg, body);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}

