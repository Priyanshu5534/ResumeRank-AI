import { cn } from '@/lib/utils';
import { scoreToColor } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreRing({ score, size = 'md', className }: ScoreRingProps) {
  const roundedScore = Math.round(score);
  const color = scoreToColor(roundedScore);

  const sizes = {
    sm: { r: 14, stroke: 3.5, text: 'text-xs', w: 36 },
    md: { r: 20, stroke: 4.5, text: 'text-sm font-bold', w: 52 },
    lg: { r: 32, stroke: 6, text: 'text-lg font-black', w: 80 },
  };

  const currentSize = sizes[size];
  const circumference = 2 * Math.PI * currentSize.r;
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

  return (
    <div
      className={cn('relative flex items-center justify-center shrink-0 select-none', className)}
      style={{ width: currentSize.w, height: currentSize.w }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          cx={currentSize.w / 2}
          cy={currentSize.w / 2}
          r={currentSize.r}
          className="stroke-slate-100 dark:stroke-slate-800"
          strokeWidth={currentSize.stroke}
          fill="transparent"
        />
        {/* Foreground matching progress */}
        <circle
          cx={currentSize.w / 2}
          cy={currentSize.w / 2}
          r={currentSize.r}
          stroke={color}
          strokeWidth={currentSize.stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center text score */}
      <span className={cn('absolute text-slate-800 dark:text-slate-200', currentSize.text)}>
        {roundedScore}%
      </span>
    </div>
  );
}
