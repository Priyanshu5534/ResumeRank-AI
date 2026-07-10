'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={cn(
            'absolute mt-2 w-56 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 overflow-hidden',
            {
              'right-0 origin-top-right': align === 'right',
              'left-0 origin-top-left': align === 'left',
            },
            className
          )}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
}

export function DropdownItem({ children, className, disabled, ...props }: DropdownItemProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
