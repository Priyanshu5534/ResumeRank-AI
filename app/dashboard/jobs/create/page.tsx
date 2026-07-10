'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import JobForm from '@/components/jobs/jobform';
import type { CreateJobInput } from '@/lib/validations/job';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(data: CreateJobInput) {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Job posting created successfully!');
        router.push('/dashboard/jobs');
      } else {
        toast.error(json.error || 'Failed to create job posting');
      }
    } catch {
      toast.error('Network error. Failed to save job.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Back button link */}
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to list
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Create Job Posting
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Draft a new active role positioning details, descriptions, and candidate specifications.
        </p>
      </div>

      <JobForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}