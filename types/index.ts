import { JobStatus, CandidateStatus, Role } from '@prisma/client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  company?: string | null;
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string;
  experience: number;
  location: string;
  salary?: string | null;
  status: JobStatus;
  education?: string | null;
  employmentType?: string | null;
  department?: string | null;
  closingDate?: Date | null;
  recruiterId: string;
  recruiter?: User;
  candidates?: Candidate[];
  _count?: { candidates: number };
  createdAt: Date;
  updatedAt: Date;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  status: CandidateStatus;
  notes?: string | null;
  linkedin?: string | null;
  portfolio?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  interviewStatus?: string | null;
  jobId: string;
  job?: Job;
  resume?: Resume | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  fileName: string;
  fileUrl?: string | null;
  rawText?: string | null;
  parsedData?: ParsedResumeData | null;
  contentType?: string | null;
  fileSize?: number | null;
  candidateId: string;
  analysis?: ResumeAnalysis | null;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface ResumeAnalysis {
  id: string;
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordMatch: number;
  matchedSkills: string;
  missingSkills: string;
  strengths: string;
  weaknesses: string;
  suggestions: string;
  summary: string;
  rank?: number | null;
  aiModel: string;
  resumeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  education?: string[];
  skills?: string[];
  experience?: ExperienceItem[];
  certifications?: string[];
  projects?: ProjectItem[];
  summary?: string;
  location?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description?: string;
}

export interface ProjectItem {
  name: string;
  description?: string;
  technologies?: string[];
}

export interface AIEvaluation {
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  keywordMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  totalCandidates: number;
  aiRanked: number;
  averageScore: number;
  newThisWeek: {
    jobs: number;
    candidates: number;
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  description: string;
  metadata?: any | null;
  userId: string;
  user?: { name: string; avatar?: string | null };
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  link?: string | null;
  userId: string;
  createdAt: Date;
}

export type ThemeMode = 'light' | 'dark';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
