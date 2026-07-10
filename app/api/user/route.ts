import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

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
    if (!user) return errorResponse('User not found', 404);
    return successResponse(user);
  } catch (error) {
    console.error('[GET_USER]', error);
    return errorResponse('Internal server error');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    const body = await request.json();
    const { name, company, title, avatar } = body;

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: { name, company, title, avatar },
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
    return successResponse(user, 'Profile updated successfully');
  } catch (error) {
    console.error('[UPDATE_USER]', error);
    return errorResponse('Internal server error');
  }
}
