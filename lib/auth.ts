import { cookies } from 'next/headers';
import { verifyToken } from './jwt';
import { prisma } from './prisma';
import type { TokenPayload } from '@/types';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;

    const payload = verifyToken(token) as TokenPayload;
    if (!payload?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        company: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function getTokenFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie');
  if (!cookie) return null;
  const match = cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : null;
}

export function getAuthPayload(request: Request): TokenPayload | null {
  try {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token) as TokenPayload;
  } catch {
    return null;
  }
}
