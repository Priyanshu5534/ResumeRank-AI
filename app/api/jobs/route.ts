import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { createJobSchema } from '@/lib/validations/job';
import { successResponse, errorResponse, validationError, unauthorizedError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * pageSize;

    const where = {
      recruiterId: payload.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status: status as 'OPEN' | 'CLOSED' | 'DRAFT' }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { candidates: true },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return successResponse({
      data: jobs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('[GET_JOBS]', error);
    return errorResponse('Internal server error');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    const body = await request.json();
    const result = createJobSchema.safeParse(body);
    if (!result.success) return validationError(result.error.issues);

    const job = await prisma.job.create({
      data: {
        ...result.data,
        recruiterId: payload.id,
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entity: 'JOB',
        entityId: job.id,
        description: `Created job: ${job.title}`,
        userId: payload.id,
        jobId: job.id,
      },
    });

    return successResponse(job, 'Job created successfully', 201);
  } catch (error) {
    console.error('[CREATE_JOB]', error);
    return errorResponse('Internal server error');
  }
}
