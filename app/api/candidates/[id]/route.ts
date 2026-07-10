import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { updateCandidateSchema } from '@/lib/validations/candidate';
import { successResponse, errorResponse, validationError, unauthorizedError, notFoundError } from '@/lib/api-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();
    const { id } = await params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        job: true,
        resume: {
          include: { analysis: true },
        },
        interviews: {
          orderBy: { scheduledAt: 'desc' },
        },
      },
    });

    if (!candidate) return notFoundError('Candidate');
    return successResponse(candidate);
  } catch (error) {
    console.error('[GET_CANDIDATE]', error);
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

    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) return notFoundError('Candidate');

    const body = await request.json();
    const result = updateCandidateSchema.safeParse(body);
    if (!result.success) return validationError(result.error.issues);

    const updated = await prisma.candidate.update({
      where: { id },
      data: result.data,
    });

    return successResponse(updated, 'Candidate updated successfully');
  } catch (error) {
    console.error('[UPDATE_CANDIDATE]', error);
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

    const candidate = await prisma.candidate.findUnique({ where: { id } });
    if (!candidate) return notFoundError('Candidate');

    await prisma.candidate.delete({ where: { id } });

    return successResponse(null, 'Candidate deleted successfully');
  } catch (error) {
    console.error('[DELETE_CANDIDATE]', error);
    return errorResponse('Internal server error');
  }
}
