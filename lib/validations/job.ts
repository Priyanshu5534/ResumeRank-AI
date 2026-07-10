import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  skills: z.string().min(1, 'At least one skill is required'),
  experience: z.coerce.number().min(0).max(30),
  location: z.string().min(2, 'Location is required'),
  salary: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'DRAFT']).default('OPEN'),
  education: z.string().optional(),
  employmentType: z.string().optional(),
  department: z.string().optional(),
  closingDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
