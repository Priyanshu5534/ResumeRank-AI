'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Mail, Phone, Calendar, Briefcase, FileText, Download, Sparkles, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loader';
import ResumeUpload from '@/components/candidates/ResumeUpload';
import AnalysisReport from '@/components/candidates/AnalysisReport';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [candidate, setCandidate] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [notes, setNotes] = React.useState('');
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [analyzing, setAnalyzing] = React.useState(false);

  const fetchCandidate = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/candidates/${id}`);
      if (res.ok) {
        const json = await res.json();
        setCandidate(json.data);
        setNotes(json.data.notes || '');
      } else {
        toast.error('Failed to load candidate profile');
        router.push('/dashboard/candidates');
      }
    } catch {
      toast.error('Error loading candidate profile');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  React.useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  async function handleNotesSave() {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        toast.success('Notes updated');
      } else {
        toast.error('Failed to update notes');
      }
    } catch {
      toast.error('Network error saving notes');
    } finally {
      setSavingNotes(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    try {
      const res = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        fetchCandidate();
      }
    } catch {
      toast.error('Failed to update status');
    }
  }

  async function handleTriggerAnalysis() {
    if (!candidate.resume?.id) return;
    setAnalyzing(true);
    try {
      toast.info('Starting AI Resume Match Analysis...');
      const res = await fetch(`/api/resumes/${candidate.resume.id}/analyze`, {
        method: 'POST',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success(`Analysis completed. Score: ${Math.round(json.data.analysis.overallScore)}%`);
        fetchCandidate();
      } else {
        toast.error(json.error || 'AI analysis failed');
      }
    } catch {
      toast.error('Network error during AI analysis');
    } finally {
      setAnalyzing(false);
    }
  }

  function handleDownloadResume() {
    if (!candidate.resume?.rawText) return;
    const blob = new Blob([candidate.resume.rawText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidate.name.replace(/\s+/g, '_')}_resume.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Resume downloaded successfully');
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const resume = candidate.resume;
  const analysis = resume?.analysis;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/jobs/${candidate.jobId}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Pipeline
        </Link>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold">
          {['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                candidate.status === st
                  ? st === 'SELECTED'
                    ? 'bg-emerald-600 text-white'
                    : st === 'REJECTED'
                    ? 'bg-red-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate Profile Details Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-8 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              {candidate.name}
            </h1>
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
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              Applied for: <Link href={`/dashboard/jobs/${candidate.job.id}`} className="hover:text-blue-600 font-semibold">{candidate.job.title}</Link>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-slate-400" />
              {candidate.email}
            </span>
            {candidate.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-slate-400" />
                {candidate.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Applied {formatDate(candidate.createdAt)}
            </span>
          </div>
        </div>

        {resume && !analysis && (
          <Button variant="primary" loading={analyzing} onClick={handleTriggerAnalysis} className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Analyze Resume
          </Button>
        )}
      </div>

      {/* Main Analysis details or Resume upload split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {analysis ? (
            <AnalysisReport analysis={analysis} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 border flex items-center justify-center mx-auto text-slate-400">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Resume Analysis Report</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Upload candidate resume in PDF or DOCX format to trigger the real AI match scoring pipeline.
                </p>
                {!resume && (
                  <div className="max-w-md mx-auto pt-4">
                    <ResumeUpload candidateId={id} onUploadSuccess={fetchCandidate} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resume preview panels */}
          {resume?.rawText && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    Resume Document Plaintext
                  </h3>
                  <Button variant="outline" size="sm" onClick={handleDownloadResume}>
                    <Download className="w-3.5 h-3.5 mr-1" />
                    Download Extracted Text
                  </Button>
                </div>
                <div className="max-h-[500px] overflow-y-auto bg-slate-50 dark:bg-slate-950 p-5 rounded-lg border border-slate-200 dark:border-slate-850 text-xs font-mono text-slate-650 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                  {resume.rawText}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar notes & profiles */}
        <div className="space-y-6">
          {/* Quick upload if resume present but need replacing */}
          {resume && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-850 dark:text-slate-100">Upload/Replace Resume</h3>
                <ResumeUpload candidateId={id} onUploadSuccess={fetchCandidate} />
              </CardContent>
            </Card>
          )}

          {/* Recruiters notes */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-850 dark:text-slate-100">Internal Recruiter Notes</h3>
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write interview notes, reference checklists, etc..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-250 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Button variant="outline" size="sm" className="w-full" loading={savingNotes} onClick={handleNotesSave}>
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}