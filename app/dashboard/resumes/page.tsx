'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, Sparkles, FileText, Trophy, Filter, ArrowUpDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScoreRing } from '@/components/ui/score-ring';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/loader';
import { getRecommendation } from '@/services/ranking';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function ResumeRankingPage() {
  const [candidates, setCandidates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedJob, setSelectedJob] = React.useState<string>('');
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [analyzingId, setAnalyzingId] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [candidatesRes, jobsRes] = await Promise.all([
        fetch(`/api/candidates?pageSize=50${selectedJob ? `&jobId=${selectedJob}` : ''}${search ? `&search=${encodeURIComponent(search)}` : ''}`),
        fetch('/api/jobs?pageSize=50'),
      ]);

      if (candidatesRes.ok) {
        const cJson = await candidatesRes.json();
        // Sort candidates by AI overallScore descending
        const sorted = (cJson.data.data || []).sort((a: any, b: any) => {
          const scoreA = a.resume?.analysis?.overallScore ?? -1;
          const scoreB = b.resume?.analysis?.overallScore ?? -1;
          return scoreB - scoreA;
        });
        setCandidates(sorted);
      }

      if (jobsRes.ok) {
        const jJson = await jobsRes.json();
        setJobs(jJson.data.data || []);
      }
    } catch {
      toast.error('Failed to load resume ranking data');
    } finally {
      setLoading(false);
    }
  }, [search, selectedJob]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleTriggerAnalysis(resumeId: string) {
    setAnalyzingId(resumeId);
    try {
      toast.info('Running AI Resume Match Analysis...');
      const res = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: 'POST',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`Analysis completed. Score: ${Math.round(json.data.analysis.overallScore)}%`);
        fetchData();
      } else {
        toast.error(json.error || 'AI analysis failed');
      }
    } catch {
      toast.error('Network error during AI analysis');
    } finally {
      setAnalyzingId(null);
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            AI Leaderboard Engine
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Resume Ranking Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Candidates ranked automatically by AI based on job requirement match score, skills matrix, and experience.
          </p>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search candidates across all rankings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filter by Role:
          </span>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Job Positions</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <TableSkeleton />
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-lg">No Ranked Resumes Found</p>
          <p className="text-slate-400 text-sm mt-1">Upload resumes to candidates to trigger automated AI scoring.</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-medium">
                  <th className="px-6 py-4 font-semibold w-16 text-center">Rank</th>
                  <th className="px-6 py-4 font-semibold">Candidate</th>
                  <th className="px-6 py-4 font-semibold">Target Role</th>
                  <th className="px-6 py-4 font-semibold text-center">AI Match Score</th>
                  <th className="px-6 py-4 font-semibold">AI Fit Verdict</th>
                  <th className="px-6 py-4 font-semibold">Matched Skills</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {candidates.map((candidate, index) => {
                  const resume = candidate.resume;
                  const analysis = resume?.analysis;
                  const score = analysis?.overallScore;
                  const recommendation = score !== undefined ? getRecommendation(score) : null;

                  return (
                    <tr
                      key={candidate.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-850/30 transition-colors"
                    >
                      {/* Rank badge */}
                      <td className="px-6 py-4 text-center">
                        {score !== undefined ? (
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                              index === 0
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 ring-2 ring-amber-400/50'
                                : index === 1
                                ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                : index === 2
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300'
                                : 'text-slate-500'
                            }`}
                          >
                            #{index + 1}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Candidate */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={candidate.name} size="sm" />
                          <div>
                            <Link
                              href={`/dashboard/candidates/${candidate.id}`}
                              className="font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors"
                            >
                              {candidate.name}
                            </Link>
                            <p className="text-xs text-slate-400 mt-0.5">{candidate.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 font-medium text-slate-600 dark:text-slate-300">
                        <Link
                          href={`/dashboard/jobs/${candidate.job?.id || candidate.jobId || ''}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {candidate.job?.title || 'Assigned Position'}
                        </Link>
                      </td>

                      {/* AI Match Score */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {score !== undefined ? (
                            <ScoreRing score={score} size="sm" />
                          ) : (
                            <span className="text-xs text-slate-400 italic">Pending</span>
                          )}
                        </div>
                      </td>

                      {/* Verdict */}
                      <td className="px-6 py-4">
                        {recommendation ? (
                          <Badge
                            variant={
                              recommendation.color === 'green'
                                ? 'success'
                                : recommendation.color === 'blue'
                                ? 'info'
                                : recommendation.color === 'yellow'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {recommendation.label}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Skills snippet */}
                      <td className="px-6 py-4 max-w-xs">
                        {analysis?.matchedSkills ? (
                          <div className="flex flex-wrap gap-1">
                            {analysis.matchedSkills
                              .split(',')
                              .slice(0, 3)
                              .map((sk: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                                >
                                  {sk.trim()}
                                </span>
                              ))}
                            {analysis.matchedSkills.split(',').length > 3 && (
                              <span className="text-[11px] text-slate-400 font-semibold px-1">
                                +{analysis.matchedSkills.split(',').length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        {resume ? (
                          score === undefined ? (
                            <Button
                              variant="primary"
                              size="sm"
                              loading={analyzingId === resume.id}
                              onClick={() => handleTriggerAnalysis(resume.id)}
                              className="bg-purple-600 hover:bg-purple-700 text-xs py-1.5 h-auto cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 mr-1" />
                              Analyze
                            </Button>
                          ) : (
                            <Link href={`/dashboard/candidates/${candidate.id}`}>
                              <Button variant="outline" size="sm" className="text-xs py-1.5 h-auto">
                                View Full Report
                              </Button>
                            </Link>
                          )
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Resume</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}