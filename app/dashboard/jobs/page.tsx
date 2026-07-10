'use client';

import * as React from 'react';
import Link from 'next/link';
import { PlusCircle, Search, ListFilter, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/loader';
import JobCard from '@/components/jobs/jobcard';
import JobTable from '@/components/jobs/jobtable';
import { toast } from 'sonner';

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');

  const fetchJobs = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/jobs', window.location.origin);
      url.searchParams.set('page', String(page));
      if (search) url.searchParams.set('search', search);
      if (status) url.searchParams.set('status', status);

      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setJobs(json.data.data);
        setTotal(json.data.total);
      }
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  React.useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this job posting? This will remove all associated candidates.')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Job posting deleted');
        fetchJobs();
      } else {
        toast.error('Failed to delete job');
      }
    } catch {
      toast.error('Error deleting job');
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header title */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Job Postings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your hiring pipelines, descriptions, and view applicant match analytics.
          </p>
        </div>
        <Link href="/dashboard/jobs/create">
          <Button variant="primary" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Create Job
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by job title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            {[
              { val: '', label: 'All Status' },
              { val: 'OPEN', label: 'Open' },
              { val: 'CLOSED', label: 'Closed' },
              { val: 'DRAFT', label: 'Draft' },
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => {
                  setStatus(t.val);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                  status === t.val
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-blue-600' : 'text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-blue-600' : 'text-slate-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content grid/list */}
      {loading ? (
        <TableSkeleton />
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-slate-500 font-semibold text-lg">No Job Postings Found</p>
          <p className="text-slate-400 text-sm mt-1">Get started by creating your first job opening.</p>
          <Link href="/dashboard/jobs/create" className="mt-4 inline-block">
            <Button variant="primary">Create Job</Button>
          </Link>
        </div>
      ) : viewMode === 'list' ? (
        <JobTable jobs={jobs} onDelete={handleDelete} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}