import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const SALT_ROUNDS = 10;

type SessionData = {
  user: { id: string };
  expires: string;
};

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return await compare(password, hash);
}

export async function createSession(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(key);
}

export async function setSession({
  userId = '1',
  expiresIn = 30 * 60 * 1000,
}: {
  userId: string;
  expiresIn?: number;
}) {
  const timeToExpire = new Date(Date.now() + expiresIn);
  const session: SessionData = {
    user: { id: userId },
    expires: timeToExpire.toISOString(),
  };

  (await cookies()).set('session', JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: timeToExpire,
  });
}
