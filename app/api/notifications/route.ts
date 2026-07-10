import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    const notifications = await prisma.notification.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: payload.id, read: false },
    });

    return successResponse({ notifications, unreadCount });
  } catch (error) {
    console.error('[GET_NOTIFICATIONS]', error);
    return errorResponse('Internal server error');
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    // Mark all as read
    await prisma.notification.updateMany({
      where: { userId: payload.id, read: false },
      data: { read: true },
    });

    return successResponse(null, 'All notifications marked as read');
  } catch (error) {
    console.error('[MARK_NOTIFICATIONS]', error);
    return errorResponse('Internal server error');
  }
}
