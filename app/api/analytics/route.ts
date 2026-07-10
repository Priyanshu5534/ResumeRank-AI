import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedError } from '@/lib/api-response';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const payload = getAuthPayload(request);
    if (!payload) return unauthorizedError();

    const now = new Date();

    // 1. Dashboard summary cards
    const [totalJobs, openJobs, totalCandidates, rankedCandidates, avgScoreResult] = await Promise.all([
      prisma.job.count({ where: { recruiterId: payload.id } }),
      prisma.job.count({ where: { recruiterId: payload.id, status: 'OPEN' } }),
      prisma.candidate.count({ where: { job: { recruiterId: payload.id } } }),
      prisma.resumeAnalysis.count({
        where: {
          resume: {
            candidate: {
              job: {
                recruiterId: payload.id,
              },
            },
          },
        },
      }),
      prisma.resumeAnalysis.aggregate({
        where: {
          resume: {
            candidate: {
              job: {
                recruiterId: payload.id,
              },
            },
          },
        },
        _avg: {
          overallScore: true,
        },
      }),
    ]);

    // 2. Job Status distribution (Pie Chart)
    const jobsByStatus = await prisma.job.groupBy({
      by: ['status'],
      where: { recruiterId: payload.id },
      _count: {
        _all: true,
      },
    });

    // 3. Candidate Status distribution
    const candidatesByStatus = await prisma.candidate.groupBy({
      by: ['status'],
      where: { job: { recruiterId: payload.id } },
      _count: {
        _all: true,
      },
    });

    // 4. Monthly Hiring trend (Bar Chart - last 6 months)
    const monthlyHiring = [];
    const applicationTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const monthLabel = format(monthDate, 'MMM');

      const [hiresCount, appsCount] = await Promise.all([
        prisma.candidate.count({
          where: {
            job: { recruiterId: payload.id },
            status: 'SELECTED',
            updatedAt: { gte: start, lte: end },
          },
        }),
        prisma.candidate.count({
          where: {
            job: { recruiterId: payload.id },
            createdAt: { gte: start, lte: end },
          },
        }),
      ]);

      monthlyHiring.push({ month: monthLabel, hired: hiresCount });
      applicationTrend.push({ month: monthLabel, applications: appsCount });
    }

    // 5. Recent Activity Timeline
    const recentActivity = await prisma.activityLog.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    });

    // 6. Recent candidates
    const recentCandidates = await prisma.candidate.findMany({
      where: { job: { recruiterId: payload.id } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        job: { select: { title: true } },
        resume: { include: { analysis: true } },
      },
    });

    // 7. Recent jobs
    const recentJobs = await prisma.job.findMany({
      where: { recruiterId: payload.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        _count: { select: { candidates: true } },
      },
    });

    // 8. Top Ranked Candidates
    const topCandidates = await prisma.candidate.findMany({
      where: {
        job: { recruiterId: payload.id },
        resume: {
          analysis: {
            overallScore: { gte: 1 },
          },
        },
      },
      orderBy: {
        resume: {
          analysis: {
            overallScore: 'desc',
          },
        },
      },
      take: 5,
      include: {
        job: { select: { title: true } },
        resume: { include: { analysis: true } },
      },
    });

    // 9. Week-over-week changes
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const [newJobsThisWeek, newCandidatesThisWeek] = await Promise.all([
      prisma.job.count({
        where: { recruiterId: payload.id, createdAt: { gte: weekAgo } },
      }),
      prisma.candidate.count({
        where: { job: { recruiterId: payload.id }, createdAt: { gte: weekAgo } },
      }),
    ]);

    // 10. Skill distribution (Top skills extracted from candidate profiles)
    // We mock this based on candidates' resume matchedSkills, to avoid complex sql parsing
    const skillMap: Record<string, number> = {};
    const analyses = await prisma.resumeAnalysis.findMany({
      where: {
        resume: {
          candidate: {
            job: {
              recruiterId: payload.id,
            },
          },
        },
      },
      select: { matchedSkills: true },
    });

    analyses.forEach((a) => {
      if (a.matchedSkills) {
        a.matchedSkills.split(',').forEach((s) => {
          const name = s.trim();
          if (name) {
            skillMap[name] = (skillMap[name] || 0) + 1;
          }
        });
      }
    });

    const skillDistribution = Object.entries(skillMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return successResponse({
      stats: {
        totalJobs,
        openJobs,
        totalCandidates,
        aiRanked: rankedCandidates,
        averageScore: Math.round(avgScoreResult._avg.overallScore || 0),
        newThisWeek: {
          jobs: newJobsThisWeek,
          candidates: newCandidatesThisWeek,
        },
      },
      jobsByStatus: jobsByStatus.map((j) => ({ name: j.status, value: j._count._all })),
      candidatesByStatus: candidatesByStatus.map((c) => ({ name: c.status, value: c._count._all })),
      monthlyHiring,
      applicationTrend,
      recentActivity,
      recentCandidates,
      recentJobs,
      topCandidates,
      skillDistribution,
    });
  } catch (error) {
    console.error('[ANALYTICS_API]', error);
    return errorResponse('Internal server error');
  }
}
