import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!authCookie || authCookie.value !== 'ok') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect root to dashboard if logged in, else login
  if (request.nextUrl.pathname === '/') {
    if (authCookie && authCookie.value === 'ok') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/'],
};
