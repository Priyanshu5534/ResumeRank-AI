import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { MapPin, Calendar, Users } from 'lucide-react';

interface RecentJobsTableProps {
  jobs: {
    id: string;
    title: string;
    location: string;
    status: string;
    createdAt: Date | string;
    _count: { candidates: number };
  }[];
}

export default function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Job Postings</CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            No job postings created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                  <th className="pb-3 font-semibold">Job Title</th>
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">Candidates</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Posted Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5">
                      <Link href={`/dashboard/jobs/${job.id}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 transition-colors">
                        {job.title}
                      </Link>
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <Users className="w-4 h-4 text-slate-400" />
                        {job._count.candidates}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <Badge variant={job.status === 'OPEN' ? 'success' : job.status === 'CLOSED' ? 'danger' : 'warning'}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(job.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
