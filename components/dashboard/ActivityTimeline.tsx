import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
import {
  PlusCircle,
  UploadCloud,
  FileCheck,
  Trash2,
  Edit,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  activities: {
    id: string;
    action: string;
    description: string;
    createdAt: Date | string;
    user: { name: string };
  }[];
}

const getActionIcon = (action: string) => {
  switch (action) {
    case 'CREATE':
      return <PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'UPLOAD':
      return <UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    case 'ANALYZE':
      return <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case 'UPDATE':
      return <Edit className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case 'DELETE':
      return <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />;
    default:
      return <UserPlus className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
  }
};

const getActionBg = (action: string) => {
  switch (action) {
    case 'CREATE':
      return 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50';
    case 'UPLOAD':
      return 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50';
    case 'ANALYZE':
      return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50';
    case 'UPDATE':
      return 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50';
    case 'DELETE':
      return 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50';
    default:
      return 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700/50';
  }
};

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-12 text-sm text-slate-400">
            No recent activities recorded.
          </div>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3.5 space-y-6 py-2">
            {activities.map((activity) => (
              <div key={activity.id} className="relative pl-7 group">
                {/* Timeline dot/icon */}
                <span
                  className={cn(
                    'absolute -left-3.5 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border shadow-sm transition-transform duration-200 group-hover:scale-105',
                    getActionBg(activity.action)
                  )}
                >
                  {getActionIcon(activity.action)}
                </span>
                
                {/* Timeline text details */}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span>by {activity.user.name}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
