'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobSchema, type CreateJobInput } from '@/lib/validations/job';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { EMPLOYMENT_TYPES, EDUCATION_LEVELS, EXPERIENCE_OPTIONS } from '@/constants';
import { toast } from 'sonner';

interface JobFormProps {
  initialValues?: Partial<CreateJobInput>;
  onSubmit: (data: CreateJobInput) => Promise<void>;
  loading?: boolean;
}

export default function JobForm({ initialValues, onSubmit, loading }: JobFormProps) {
  // Convert Date object to string if edit mode
  const defaultValues = {
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    skills: initialValues?.skills || '',
    experience: initialValues?.experience ?? 1,
    location: initialValues?.location || '',
    salary: initialValues?.salary || '',
    status: initialValues?.status || 'OPEN',
    education: initialValues?.education || 'BACHELOR',
    employmentType: initialValues?.employmentType || 'FULL_TIME',
    department: initialValues?.department || 'Engineering',
    closingDate: initialValues?.closingDate ? new Date(initialValues.closingDate).toISOString().split('T')[0] : '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema) as any,
    defaultValues: defaultValues as any,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Job Title"
          placeholder="e.g. Senior Full Stack Engineer"
          error={errors.title?.message}
          {...register('title')}
        />
        <Input
          label="Location"
          placeholder="e.g. San Francisco, CA / Remote"
          error={errors.location?.message}
          {...register('location')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Select
          label="Employment Type"
          options={EMPLOYMENT_TYPES as any}
          error={errors.employmentType?.message}
          {...register('employmentType')}
        />
        <Select
          label="Education Required"
          options={EDUCATION_LEVELS as any}
          error={errors.education?.message}
          {...register('education')}
        />
        <Select
          label="Required Experience"
          options={EXPERIENCE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          error={errors.experience?.message}
          {...register('experience')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Department / Team"
          placeholder="e.g. Engineering"
          error={errors.department?.message}
          {...register('department')}
        />
        <Input
          label="Salary / Budget"
          placeholder="e.g. $120,000 - $150,000"
          error={errors.salary?.message}
          {...register('salary')}
        />
        <Input
          label="Closing Date"
          type="date"
          error={errors.closingDate?.message}
          {...register('closingDate')}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Job Description
        </label>
        <textarea
          rows={6}
          placeholder="Outline roles, responsibilities, project scope, and benefits..."
          className="flex w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          {...register('description')}
        />
        {errors.description?.message && (
          <p className="text-xs text-red-600 font-medium">{errors.description.message}</p>
        )}
      </div>

      <Input
        label="Required Skills (Comma-separated)"
        placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
        error={errors.skills?.message}
        {...register('skills')}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button variant="primary" type="submit" loading={loading} className="w-40">
          Save Job Posting
        </Button>
      </div>
    </form>
  );
}
