import { NextResponse } from 'next/server';

export function middleware(request) {
  // eliminamos temporalmente el middleware de autenticación en producción

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img).*)'],
};
