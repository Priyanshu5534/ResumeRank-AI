export const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Jobs', href: '/dashboard/jobs', icon: 'Briefcase' },
  { name: 'Candidates', href: '/dashboard/candidates', icon: 'Users' },
  { name: 'Resume Ranking', href: '/dashboard/resumes', icon: 'FileText' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: 'BarChart3' },
  { name: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
] as const;

export const JOB_STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open', color: 'green' },
  { value: 'CLOSED', label: 'Closed', color: 'red' },
  { value: 'DRAFT', label: 'Draft', color: 'yellow' },
] as const;

export const CANDIDATE_STATUS_OPTIONS = [
  { value: 'APPLIED', label: 'Applied', color: 'blue' },
  { value: 'SHORTLISTED', label: 'Shortlisted', color: 'purple' },
  { value: 'INTERVIEW', label: 'Interview', color: 'yellow' },
  { value: 'SELECTED', label: 'Selected', color: 'green' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
] as const;

export const EDUCATION_LEVELS = [
  { value: 'HIGH_SCHOOL', label: 'High School' },
  { value: 'ASSOCIATE', label: "Associate's Degree" },
  { value: 'BACHELOR', label: "Bachelor's Degree" },
  { value: 'MASTER', label: "Master's Degree" },
  { value: 'PHD', label: 'PhD' },
  { value: 'BOOTCAMP', label: 'Bootcamp / Self-Taught' },
  { value: 'ANY', label: 'Any' },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: 0, label: 'No experience required' },
  { value: 1, label: '1+ year' },
  { value: 2, label: '2+ years' },
  { value: 3, label: '3+ years' },
  { value: 5, label: '5+ years' },
  { value: 7, label: '7+ years' },
  { value: 10, label: '10+ years' },
] as const;

export const POPULAR_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Java', 'Go', 'Rust', 'C++', 'C#',
  'PostgreSQL', 'MongoDB', 'Redis', 'MySQL',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
  'GraphQL', 'REST API', 'Git', 'CI/CD', 'Agile',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
  'React Native', 'Flutter', 'Swift', 'Kotlin',
] as const;

export const DEPARTMENTS = [
  'Engineering', 'Product', 'Design', 'Marketing', 'Sales',
  'Operations', 'HR', 'Finance', 'Legal', 'Customer Success',
  'Data Science', 'DevOps', 'Security', 'Research',
] as const;

export const AI_MODELS = [
  { value: 'ResumeRank AI (BGE Fine-Tuned)', label: 'ResumeRank AI (BGE Fine-Tuned - Default)', provider: 'Local Custom Model' },
] as const;

export const ITEMS_PER_PAGE = 10;

export const SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
} as const;
