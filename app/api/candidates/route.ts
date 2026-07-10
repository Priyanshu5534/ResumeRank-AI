import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { createCandidateSchema } from '@/lib/validations/candidate';
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
    const jobId = searchParams.get('jobId') || '';
    const skip = (page - 1) * pageSize;

    const where = {
      job: {
        recruiterId: payload.id,
      },
      ...(jobId && { jobId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status: status as 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' }),
    };

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          job: {
            select: { id: true, title: true },
          },
          resume: {
            include: {
              analysis: true,
            },
          },
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    return successResponse({
      data: candidates,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('[GET_CANDIDATES]', error);
    return errorResponse('Internal server error');
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    const body = await request.json();
    const result = createCandidateSchema.safeParse(body);
    if (!result.success) return validationError(result.error.issues);

    const candidate = await prisma.candidate.create({
      data: result.data,
      include: {
        job: {
          select: { id: true, title: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entity: 'CANDIDATE',
        entityId: candidate.id,
        description: `Added candidate: ${candidate.name}`,
        userId: payload.id,
        jobId: candidate.jobId,
      },
    });

    return successResponse(candidate, 'Candidate added successfully', 201);
  } catch (error) {
    console.error('[CREATE_CANDIDATE]', error);
    return errorResponse('Internal server error');
  }
}
