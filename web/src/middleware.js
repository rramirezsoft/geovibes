import { NextResponse } from 'next/server';

export function middleware(request) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isPublicPath = ['/', '/login', '/register'].includes(pathname);
  const isValidatePath = pathname === '/validate';
  const isDashboardPath = pathname.startsWith('/dashboard');

  // 1. Tiene refresh → sesión activa y verificada
  if (refreshToken) {
    if (!isDashboardPath) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 2. Tiene access pero NO refresh → verificado pendiente
  if (accessToken && !refreshToken) {
    if (!isValidatePath) {
      return NextResponse.redirect(new URL('/validate', request.url));
    }
  }

  // 3. No tiene access ni refresh → usuario no autenticado
  if (!accessToken && !refreshToken) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
