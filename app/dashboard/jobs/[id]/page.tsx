'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Edit, Plus, Users, MapPin, Briefcase, Calendar, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Spinner } from '@/components/ui/loader';
import CandidateForm from '@/components/candidates/candidateform';
import CandidateTable from '@/components/candidates/candidatetable';
import type { CreateCandidateInput } from '@/lib/validations/candidate';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [job, setJob] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [candidateLoading, setCandidateLoading] = React.useState(false);
  const [analyzingId, setAnalyzingId] = React.useState<string | null>(null);

  const fetchJob = React.useCallback(async () => {
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
  }, [id, router]);

  React.useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  async function handleAddCandidate(data: CreateCandidateInput) {
    setCandidateLoading(true);
    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Candidate added successfully!');
        setIsAddOpen(false);
        fetchJob();
      } else {
        toast.error(json.error || 'Failed to add candidate');
      }
    } catch {
      toast.error('Network error adding candidate');
    } finally {
      setCandidateLoading(false);
    }
  }

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
        fetchJob();
      } else {
        toast.error(json.error || 'AI analysis failed');
      }
    } catch {
      toast.error('Network error during AI analysis');
    } finally {
      setAnalyzingId(null);
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Jobs
        </Link>
        <Link href={`/dashboard/jobs/${id}/edit`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Posting
          </Button>
        </Link>
      </div>

      {/* Title & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {job.title}
            </h1>
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
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              {job.employmentType?.replace('_', ' ')}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Posted {formatDate(job.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" className="flex items-center gap-2" onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Description & skills specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Job Description</h3>
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100">Role Specifications</h3>
            
            <div className="space-y-3.5">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Salary Budget</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {job.salary || 'Competitive / Unspecified'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Experience Level</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {job.experience}+ years required
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Department</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                  {job.department || 'General'}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Required Skills</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {job.skills.split(',').map((skill: string) => (
                    <Badge key={skill} variant="neutral" className="bg-slate-100 text-slate-700">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Pipeline listings */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-400" />
          Applicant Pipeline
        </h2>

        {job.candidates?.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-slate-500 font-semibold text-base">No Candidates Applied Yet</p>
            <p className="text-slate-400 text-sm mt-1">Add candidates manually or enable public application links.</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddOpen(true)}>
              Add Candidate
            </Button>
          </div>
        ) : (
          <CandidateTable
            candidates={job.candidates}
            onTriggerAnalysis={handleTriggerAnalysis}
            analyzingId={analyzingId}
          />
        )}
      </div>

      {/* Add Candidate Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Candidate Profile">
        <CandidateForm jobId={id} onSubmit={handleAddCandidate} loading={candidateLoading} />
      </Modal>
    </div>
  );
}