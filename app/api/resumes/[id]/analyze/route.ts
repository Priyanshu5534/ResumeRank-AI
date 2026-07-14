import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { evaluateResume } from '@/services/ai';
import { rankCandidatesForJob } from '@/services/ranking';
import { successResponse, errorResponse, unauthorizedError, notFoundError } from '@/lib/api-response';

export const maxDuration = 120; // Allow enough time for evaluation

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();
    const { id } = await params;

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: {
        candidate: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!resume) return notFoundError('Resume');
    if (!resume.rawText) {
      return errorResponse('No resume text found. Please upload a valid resume first.', 400);
    }

    const candidate = resume.candidate;
    const job = candidate.job;

    // Call AI engine to evaluate candidate resume against job description
    const evaluation = await evaluateResume(
      resume.rawText,
      job.title,
      job.description,
      job.skills,
      job.experience,
      job.education || undefined
    );

    // Save evaluation back to database
    const analysis = await prisma.resumeAnalysis.upsert({
      where: { resumeId: id },
      create: {
        resumeId: id,
        overallScore: evaluation.overallScore,
        skillMatch: evaluation.skillMatch,
        experienceMatch: evaluation.experienceMatch,
        educationMatch: evaluation.educationMatch,
        keywordMatch: evaluation.keywordMatch,
        matchedSkills: evaluation.matchedSkills.join(', '),
        missingSkills: evaluation.missingSkills.join(', '),
        strengths: evaluation.strengths.join(' | '),
        weaknesses: evaluation.weaknesses.join(' | '),
        suggestions: evaluation.suggestions.join(' | '),
        summary: evaluation.summary,
        aiModel: evaluation.aiModel || process.env.AI_MODEL || 'ResumeRank AI (BGE Fine-Tuned)',
      },
      update: {
        overallScore: evaluation.overallScore,
        skillMatch: evaluation.skillMatch,
        experienceMatch: evaluation.experienceMatch,
        educationMatch: evaluation.educationMatch,
        keywordMatch: evaluation.keywordMatch,
        matchedSkills: evaluation.matchedSkills.join(', '),
        missingSkills: evaluation.missingSkills.join(', '),
        strengths: evaluation.strengths.join(' | '),
        weaknesses: evaluation.weaknesses.join(' | '),
        suggestions: evaluation.suggestions.join(' | '),
        summary: evaluation.summary,
        aiModel: evaluation.aiModel || process.env.AI_MODEL || 'ResumeRank AI (BGE Fine-Tuned)',
      },
    });

    // Automatically re-rank all candidates for this job
    await rankCandidatesForJob(job.id);

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'ANALYZE',
        entity: 'RESUME',
        entityId: id,
        description: `AI analyzed resume for ${candidate.name} — Match: ${Math.round(evaluation.overallScore)}%`,
        userId: payload.id,
        jobId: job.id,
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        title: 'Analysis Complete',
        message: `Resume analysis for ${candidate.name} has completed. Match Score: ${Math.round(evaluation.overallScore)}%`,
        type: 'SUCCESS',
        link: `/dashboard/candidates/${candidate.id}`,
        userId: payload.id,
      },
    });

    return successResponse({ analysis, evaluation }, 'Resume analyzed successfully');
  } catch (error) {
    console.error('[ANALYZE_RESUME]', error);
    return errorResponse(error instanceof Error ? error.message : 'Internal server error');
  }
}
