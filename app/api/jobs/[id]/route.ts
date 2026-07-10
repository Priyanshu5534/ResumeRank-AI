import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { updateJobSchema } from '@/lib/validations/job';
import {
  successResponse,
  errorResponse,
  validationError,
  unauthorizedError,
  notFoundError,
  forbiddenError,
} from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            resume: {
              include: { analysis: true },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: { candidates: true },
        },
      },
    });

    if (!job) return notFoundError('Job');
    if (job.recruiterId !== payload.id && payload.role !== 'ADMIN') {
      return forbiddenError();
    }

    return successResponse(job);
  } catch (error) {
    console.error('[GET_JOB]', error);
    return errorResponse('Internal server error');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();
    const { id } = await params;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return notFoundError('Job');
    if (job.recruiterId !== payload.id && payload.role !== 'ADMIN') {
      return forbiddenError();
    }

    const body = await request.json();
    const result = updateJobSchema.safeParse(body);
    if (!result.success) return validationError(result.error.issues);

    const updated = await prisma.job.update({
      where: { id },
      data: result.data,
    });

    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entity: 'JOB',
        entityId: id,
        description: `Updated job: ${updated.title}`,
        userId: payload.id,
        jobId: id,
      },
    });

    return successResponse(updated, 'Job updated successfully');
  } catch (error) {
    console.error('[UPDATE_JOB]', error);
    return errorResponse('Internal server error');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();
    const { id } = await params;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return notFoundError('Job');
    if (job.recruiterId !== payload.id && payload.role !== 'ADMIN') {
      return forbiddenError();
    }

    await prisma.job.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entity: 'JOB',
        entityId: id,
        description: `Deleted job: ${job.title}`,
        userId: payload.id,
      },
    });

    return successResponse(null, 'Job deleted successfully');
  } catch (error) {
    console.error('[DELETE_JOB]', error);
    return errorResponse('Internal server error');
  }
}
