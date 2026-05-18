import { NextResponse, type NextRequest } from 'next/server';

const AUTH_COOKIE = 'mabruk_token';

/**
 * Bloqueia acesso a /conta/* se não houver cookie de sessão.
 * Redireciona para /entrar com `?next=` para retornar pós-login.
 */
export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    const url = new URL('/entrar', req.url);
    url.searchParams.set('next', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/conta/:path*'],
};
