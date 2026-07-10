import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatDate(date: Date | string, pattern = 'MMM d, yyyy') {
  return format(new Date(date), pattern);
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), 'MMM d, yyyy • h:mm a');
}

export function formatRelativeTime(date: Date | string) {
  const d = new Date(date);
  if (isToday(d)) return `Today at ${format(d, 'h:mm a')}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, 'h:mm a')}`;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function formatCurrency(amount: string | number) {
  if (typeof amount === 'string') return amount;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function scoreToColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#eab308'; // yellow-500
  if (score >= 40) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export function parseSkills(skillsString: string): string[] {
  return skillsString
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
