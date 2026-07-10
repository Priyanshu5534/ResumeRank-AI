import { prisma } from '@/lib/prisma';

export async function rankCandidatesForJob(jobId: string): Promise<void> {
  // Fetch all candidates with resume analysis for this job
  const candidates = await prisma.candidate.findMany({
    where: { jobId },
    include: {
      resume: {
        include: { analysis: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Sort by overall score descending
  const ranked = candidates
    .filter((c) => c.resume?.analysis !== null && c.resume?.analysis !== undefined)
    .sort((a, b) => {
      const scoreA = a.resume?.analysis?.overallScore ?? 0;
      const scoreB = b.resume?.analysis?.overallScore ?? 0;
      return scoreB - scoreA;
    });

  // Update rank for each candidate with an analysis
  await Promise.all(
    ranked.map((candidate, index) => {
      if (candidate.resume?.analysis) {
        return prisma.resumeAnalysis.update({
          where: { id: candidate.resume.analysis.id },
          data: { rank: index + 1 },
        });
      }
      return Promise.resolve();
    })
  );
}

export function getRecommendation(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Highly Recommended', color: 'green' };
  if (score >= 60) return { label: 'Recommended', color: 'blue' };
  if (score >= 40) return { label: 'Consider', color: 'yellow' };
  return { label: 'Not Recommended', color: 'red' };
}
