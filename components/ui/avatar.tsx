import { getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 select-none border border-blue-200/50 dark:border-blue-900/30 overflow-hidden shadow-sm shrink-0',
        {
          'w-8 h-8 text-xs': size === 'sm',
          'w-10 h-10 text-sm': size === 'md',
          'w-14 h-14 text-lg': size === 'lg',
        },
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Remove image if error occurs to show initials
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
