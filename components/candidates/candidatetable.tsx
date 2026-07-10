import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ScoreRing } from '@/components/ui/score-ring';
import { formatDate } from '@/lib/utils';
import { Mail, Briefcase, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRecommendation } from '@/services/ranking';

interface CandidateTableProps {
  candidates: {
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: Date | string;
    job?: { id: string; title: string } | null;
    jobId?: string;
    resume?: {
      id: string;
      analysis?: {
        overallScore: number;
        rank?: number | null;
      } | null;
    } | null;
  }[];
  onTriggerAnalysis?: (resumeId: string) => Promise<void>;
  analyzingId?: string | null;
}

export default function CandidateTable({
  candidates,
  onTriggerAnalysis,
  analyzingId,
}: CandidateTableProps) {
  return (
    <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-medium">
              <th className="px-6 py-4 font-semibold">Candidate</th>
              <th className="px-6 py-4 font-semibold">Applied Position</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Applied Date</th>
              <th className="px-6 py-4 font-semibold text-center">AI Score</th>
              <th className="px-6 py-4 font-semibold">Evaluation</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {candidates.map((candidate) => {
              const resume = candidate.resume;
              const analysis = resume?.analysis;
              const score = analysis?.overallScore;
              const recommendation = score !== undefined ? getRecommendation(score) : null;

              return (
                <tr
                  key={candidate.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors"
                >
                  {/* Name / Profile initials */}
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
                        <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {candidate.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  {/* Job title */}
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <Link href={`/dashboard/jobs/${candidate.job?.id || candidate.jobId || ''}`} className="hover:text-blue-600">
                        {candidate.job?.title || 'Assigned Job'}
                      </Link>
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        candidate.status === 'SELECTED'
                          ? 'success'
                          : candidate.status === 'REJECTED'
                          ? 'danger'
                          : candidate.status === 'INTERVIEW'
                          ? 'warning'
                          : candidate.status === 'SHORTLISTED'
                          ? 'info'
                          : 'neutral'
                      }
                    >
                      {candidate.status}
                    </Badge>
                  </td>
                  
                  {/* Applied date */}
                  <td className="px-6 py-4 text-slate-400">
                    {formatDate(candidate.createdAt)}
                  </td>
                  
                  {/* Match score ring */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {score !== undefined ? (
                        <ScoreRing score={score} size="sm" />
                      ) : (
                        <span className="text-xs text-slate-400 italic">Unprocessed</span>
                      )}
                    </div>
                  </td>
                  
                  {/* AI Recommendation */}
                  <td className="px-6 py-4">
                    {recommendation ? (
                      <Badge
                        variant={
                          recommendation.color === 'green'
                            ? 'success'
                            : recommendation.color === 'red'
                            ? 'danger'
                            : recommendation.color === 'blue'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {recommendation.label}
                      </Badge>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {resume ? (
                        score === undefined ? (
                          <Button
                            variant="primary"
                            size="sm"
                            loading={analyzingId === resume.id}
                            onClick={() => onTriggerAnalysis?.(resume.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-xs px-2.5 py-1.5 h-auto cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1" />
                            Analyze
                          </Button>
                        ) : (
                          <Link href={`/dashboard/candidates/${candidate.id}`}>
                            <Button variant="outline" size="sm" className="text-xs h-auto py-1.5">
                              <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" />
                              Report
                            </Button>
                          </Link>
                        )
                      ) : (
                        <span className="text-xs text-slate-400 italic">No Resume</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
