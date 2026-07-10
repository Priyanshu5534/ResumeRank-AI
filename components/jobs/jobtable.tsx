import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { MapPin, Users, Calendar, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JobTableProps {
  jobs: {
    id: string;
    title: string;
    location: string;
    status: string;
    createdAt: Date | string;
    _count: { candidates: number };
  }[];
  onDelete: (id: string) => Promise<void>;
}

export default function JobTable({ jobs, onDelete }: JobTableProps) {
  return (
    <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 font-medium">
              <th className="px-6 py-4 font-semibold">Job Details</th>
              <th className="px-6 py-4 font-semibold">Location</th>
              <th className="px-6 py-4 font-semibold text-center">Applicants</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Posted Date</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors"
              >
                {/* Title */}
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors block text-base"
                  >
                    {job.title}
                  </Link>
                </td>
                
                {/* Location */}
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {job.location}
                  </span>
                </td>
                
                {/* Candidates Count */}
                <td className="px-6 py-4 text-center">
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-full text-xs font-semibold"
                  >
                    <Users className="w-3.5 h-3.5" />
                    {job._count.candidates}
                  </Link>
                </td>
                
                {/* Status */}
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      job.status === 'OPEN'
                        ? 'success'
                        : job.status === 'CLOSED'
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {job.status}
                  </Badge>
                </td>
                
                {/* Created Date */}
                <td className="px-6 py-4 text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(job.createdAt)}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/jobs/${job.id}/edit`}>
                      <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-lg">
                        <Edit className="w-4 h-4 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(job.id)}
                      className="p-1 h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
