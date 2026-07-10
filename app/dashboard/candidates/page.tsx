'use client';

import * as React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/loader';
import CandidateCard from '@/components/candidates/candidatecard';
import CandidateTable from '@/components/candidates/candidatetable';
import { toast } from 'sonner';

export default function CandidatesPage() {
  const [candidates, setCandidates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list');
  const [analyzingId, setAnalyzingId] = React.useState<string | null>(null);

  const fetchCandidates = React.useCallback(async () => {
    setLoading(true);
    try {
      const url = new URL('/api/candidates', window.location.origin);
      url.searchParams.set('page', String(page));
      if (search) url.searchParams.set('search', search);
      if (status) url.searchParams.set('status', status);

      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setCandidates(json.data.data);
      }
    } catch {
      toast.error('Failed to fetch candidates list');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  React.useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  async function handleTriggerAnalysis(resumeId: string) {
    setAnalyzingId(resumeId);
    try {
      toast.info('Starting AI Resume Match Analysis...');
      const res = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: 'POST',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`Analysis completed. Score: ${Math.round(json.data.analysis.overallScore)}%`);
        fetchCandidates();
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Candidates Directory
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review all applicant records, check match ratios, and run AI resume parsing evaluations.
        </p>
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
            placeholder="Search candidates by name or email..."
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
              { val: 'APPLIED', label: 'Applied' },
              { val: 'SHORTLISTED', label: 'Shortlisted' },
              { val: 'INTERVIEW', label: 'Interview' },
              { val: 'SELECTED', label: 'Selected' },
              { val: 'REJECTED', label: 'Rejected' },
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
      ) : candidates.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <p className="text-slate-500 font-semibold text-lg">No Candidates Found</p>
          <p className="text-slate-400 text-sm mt-1">Applicants will appear here once they upload resumes or are added.</p>
        </div>
      ) : viewMode === 'list' ? (
        <CandidateTable
          candidates={candidates}
          onTriggerAnalysis={handleTriggerAnalysis}
          analyzingId={analyzingId}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </div>
  );
}