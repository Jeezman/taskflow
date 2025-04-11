import { NextRequest, NextResponse } from 'next/server';
import { setSession, verifyToken } from '@/lib/auth/session';

const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const res = NextResponse.next();

  if (sessionCookie) {
    try {
      const payload = await verifyToken(sessionCookie.value);
      const expiresInThirtyMinutes = 30 * 60 * 1000;
      await setSession({
        userId: payload.user.id,
        expiresIn: expiresInThirtyMinutes,
      });
    } catch (error) {
      console.error('Session error:', error);
      res.cookies.delete('session');
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return res;
}
