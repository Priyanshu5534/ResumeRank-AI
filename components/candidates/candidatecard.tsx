import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { ScoreRing } from '@/components/ui/score-ring';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { getRecommendation } from '@/services/ranking';

interface CandidateCardProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    status: string;
    createdAt: Date | string;
    job: { title: string };
    resume?: {
      analysis?: {
        overallScore: number;
      } | null;
    } | null;
  };
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const score = candidate.resume?.analysis?.overallScore;
  const recommendation = score !== undefined ? getRecommendation(score) : null;

  return (
    <Card hoverable className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-200">
      <CardContent className="p-6 space-y-4">
        {/* Header - Name & Progress Ring */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <Avatar name={candidate.name} size="md" />
            <div>
              <Link
                href={`/dashboard/candidates/${candidate.id}`}
                className="font-bold text-base text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors leading-tight"
              >
                {candidate.name}
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 inline-flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {candidate.job.title}
              </p>
            </div>
          </div>

          {score !== undefined && <ScoreRing score={score} size="md" />}
        </div>

        {/* Contact info list */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{candidate.email}</span>
          </span>
          {candidate.phone && (
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.phone}</span>
            </span>
          )}
          <span className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Applied {formatDate(candidate.createdAt)}</span>
          </span>
        </div>

        {/* Status badges */}
        <div className="flex justify-between items-center pt-2 gap-4">
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

          {recommendation && (
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
              className="px-2 py-0 text-[10px]"
            >
              {recommendation.label}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
