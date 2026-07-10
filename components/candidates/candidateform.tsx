'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCandidateSchema, type CreateCandidateInput } from '@/lib/validations/candidate';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CANDIDATE_STATUS_OPTIONS } from '@/constants';

interface CandidateFormProps {
  jobId: string;
  onSubmit: (data: CreateCandidateInput) => Promise<void>;
  loading?: boolean;
}

export default function CandidateForm({ jobId, onSubmit, loading }: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCandidateInput>({
    resolver: zodResolver(createCandidateSchema) as any,
    defaultValues: {
      jobId,
      name: '',
      email: '',
      phone: '',
      status: 'APPLIED',
      notes: '',
      linkedin: '',
      portfolio: '',
      address: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. john@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Phone Number"
          placeholder="e.g. +1 (555) 019-2834"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Select
          label="Application Status"
          options={CANDIDATE_STATUS_OPTIONS as any}
          error={errors.status?.message}
          {...register('status')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="LinkedIn URL"
          placeholder="e.g. https://linkedin.com/in/username"
          error={errors.linkedin?.message}
          {...register('linkedin')}
        />
        <Input
          label="Portfolio / Website URL"
          placeholder="e.g. https://myportfolio.com"
          error={errors.portfolio?.message}
          {...register('portfolio')}
        />
      </div>

      <Input
        label="Location / Address"
        placeholder="e.g. Austin, TX"
        error={errors.address?.message}
        {...register('address')}
      />

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-350">
          Internal Recruiter Notes
        </label>
        <textarea
          rows={3}
          placeholder="Add applicant background, key referral indicators, etc."
          className="flex w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-450 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          {...register('notes')}
        />
        {errors.notes?.message && (
          <p className="text-xs text-red-600 font-medium">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="primary" type="submit" loading={loading} className="w-full">
          Add Candidate
        </Button>
      </div>
    </form>
  );
}
