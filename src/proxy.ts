import { NextResponse, type NextRequest } from 'next/server';

const CUSTOMER_COOKIE = 'mabruk_token';
const ADMIN_COOKIE = 'mabruk_admin_token';

/**
 * Bloqueia acesso a rotas autenticadas:
 *  - /conta/* exige cookie do cliente
 *  - /admin/* exige cookie do admin (exceto /admin/entrar)
 */
export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith('/conta')) {
    const token = req.cookies.get(CUSTOMER_COOKIE)?.value;
    if (!token) {
      const url = new URL('/entrar', req.url);
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (path.startsWith('/admin') && path !== '/admin/entrar') {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/entrar', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/conta/:path*', '/admin/:path*'],
};
