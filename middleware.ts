import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth/session';
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

  if (sessionCookie) {
    try {
      const expiresInThirtyMinutes = 30 * 60 * 1000;
      const dateToExpire = new Date(Date.now() + 30 * 60 * 1000);
      if (dateToExpire < new Date()) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      setSession({ userId: '1', expiresIn: expiresInThirtyMinutes });
    } catch (error) {
      console.error('Error updating session cookie', error);
      res.cookies.delete('session');
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return res;
}
