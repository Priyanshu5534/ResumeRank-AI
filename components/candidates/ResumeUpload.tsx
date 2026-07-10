'use client';

import * as React from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/lib/utils';

interface ResumeUploadProps {
  candidateId: string;
  onUploadSuccess: (data: { resume: any; parsedData: any }) => void;
}

export default function ResumeUpload({ candidateId, onUploadSuccess }: ResumeUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = React.useState<{ name: string; size: number } | null>(null);

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setError(null);
      setUploadedFile(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('candidateId', candidateId);

      try {
        const res = await fetch('/api/resumes/upload', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        if (res.ok && json.success) {
          setUploadedFile({ name: file.name, size: file.size });
          onUploadSuccess(json.data);
        } else {
          setError(json.error || 'Failed to upload resume.');
        }
      } catch (err) {
        setError('Network error occurred during upload.');
      } finally {
        setUploading(false);
      }
    },
    [candidateId, onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[200px]',
          isDragActive
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/10'
            : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white dark:bg-slate-900',
          uploading && 'opacity-65 pointer-events-none'
        )}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Uploading & parsing resume details...
            </p>
            <p className="text-xs text-slate-400">Extracting skills, experience, and profile details</p>
          </div>
        ) : uploadedFile ? (
          <div className="space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-pulse-slow" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-slate-400">{formatFileSize(uploadedFile.size)} • Success</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 underline font-semibold mt-2">
              Replace file
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-500 dark:text-slate-400 shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Drag and drop your resume file here
              </p>
              <p className="text-xs text-slate-400 mt-1">Supports PDF, DOCX, or TXT up to 10MB</p>
            </div>
            <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 px-3 py-1.5 rounded-lg inline-block cursor-pointer">
              Select File
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
