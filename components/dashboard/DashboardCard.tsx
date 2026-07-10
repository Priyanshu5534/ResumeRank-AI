import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  trend,
}: DashboardCardProps) {
  return (
    <Card hoverable className="p-6 relative group transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            {value}
          </h2>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-2">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border',
                    trend.direction === 'up'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                      : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
                  )}
                >
                  {trend.direction === 'up' ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 mr-1 text-red-600 dark:text-red-400" />
                  )}
                  {trend.value}%
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-none">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon wrapper */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm border border-black/5 dark:border-white/5 group-hover:scale-105',
            color
          )}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}