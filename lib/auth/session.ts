import { compare, hash } from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const key = new TextEncoder().encode(process.env.SESSION_SECRET);
const SALT_ROUNDS = 10;

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
