import { z } from 'zod';

export const createCandidateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  jobId: z.string().min(1, 'Job ID is required'),
  status: z.enum(['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED']).default('APPLIED'),
  notes: z.string().optional(),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  address: z.string().optional(),
});

export const updateCandidateSchema = createCandidateSchema.partial().omit({ jobId: true });

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
