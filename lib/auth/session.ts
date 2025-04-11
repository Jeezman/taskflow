import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const SALT_ROUNDS = 10;

type SessionData = {
  user: { id: string };
  expires?: string;
};

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string) {
  return await compare(password, hash);
}

export async function signToken(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .sign(key);
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as SessionData;
}

export async function getSession() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;
  return await verifyToken(session);
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

  const encodedSession = await signToken(session);

  (await cookies()).set('session', encodedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: timeToExpire,
  });
}
