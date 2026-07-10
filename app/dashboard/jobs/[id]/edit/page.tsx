'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import JobForm from '@/components/jobs/jobform';
import type { UpdateJobInput } from '@/lib/validations/job';
import { Spinner } from '@/components/ui/loader';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const json = await res.json();
          setJob(json.data);
        } else {
          toast.error('Failed to load job details');
          router.push('/dashboard/jobs');
        }
      } catch {
        toast.error('Network error loading job details');
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id, router]);

  async function handleSubmit(data: UpdateJobInput) {
    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Job details updated successfully!');
        router.push(`/dashboard/jobs/${id}`);
      } else {
        toast.error(json.error || 'Failed to update job posting');
      }
    } catch {
      toast.error('Network error updating job posting.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      <div>
        <Link
          href={`/dashboard/jobs/${id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Cancel edit
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Edit Job Posting
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Modify the specifications or details for the {job.title} role.
        </p>
      </div>

      <JobForm initialValues={job} onSubmit={handleSubmit as any} loading={saving} />
    </div>
  );
}
