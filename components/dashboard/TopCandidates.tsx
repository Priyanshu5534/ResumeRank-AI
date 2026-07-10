import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScoreRing } from '@/components/ui/score-ring';
import { Badge } from '@/components/ui/badge';
import { getRecommendation } from '@/services/ranking';

interface TopCandidatesProps {
  candidates: {
    id: string;
    name: string;
    job?: { title: string } | null;
    resume: {
      analysis: {
        overallScore: number;
      } | null;
    } | null;
  }[];
}

export default function TopCandidates({ candidates }: TopCandidatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top AI Ranked Candidates</CardTitle>
      </CardHeader>
      <CardContent>
        {candidates.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-400">
            No candidate resumes analyzed yet.
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => {
              const score = candidate.resume?.analysis?.overallScore || 0;
              const recommendation = getRecommendation(score);

              return (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={candidate.name} size="sm" />
                    <div>
                      <Link
                        href={`/dashboard/candidates/${candidate.id}`}
                        className="font-bold text-sm text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors"
                      >
                        {candidate.name}
                      </Link>
                      <p className="text-xs text-slate-400 line-clamp-1">{candidate.job?.title || 'Assigned Position'}</p>
                      <div className="mt-1">
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
                          className="px-1.5 py-0 text-[10px]"
                        >
                          {recommendation.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <ScoreRing score={score} size="sm" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
