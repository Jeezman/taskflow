import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    console.log('Redirecting to login', request.url);
    console.log('Session cookie', sessionCookie);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const res = NextResponse.next();

  return res;
}
