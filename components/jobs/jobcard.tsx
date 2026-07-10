import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, DollarSign, BrainCircuit } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    status: string;
    salary?: string | null;
    employmentType?: string | null;
    createdAt: Date | string;
    _count: { candidates: number };
  };
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card hoverable className="flex flex-col justify-between h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-200">
      <CardContent className="p-6 space-y-4">
        {/* Title & Status */}
        <div className="flex justify-between items-start gap-4">
          <Link href={`/dashboard/jobs/${job.id}`} className="font-bold text-lg text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors leading-tight">
            {job.title}
          </Link>
          <Badge variant={job.status === 'OPEN' ? 'success' : job.status === 'CLOSED' ? 'danger' : 'warning'}>
            {job.status}
          </Badge>
        </div>

        {/* Details list */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              {job.salary}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-slate-400" />
            {job.employmentType?.replace('_', ' ') || 'Full Time'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(job.createdAt)}
          </span>
        </div>

        {/* Description Snippet */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 font-semibold">
          <Users className="w-4 h-4 text-blue-500" />
          {job._count.candidates} Applicants
        </span>
        
        <Link href={`/dashboard/jobs/${job.id}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center gap-1">
          View Pipeline →
        </Link>
      </CardFooter>
    </Card>
  );
}
