'use client';

import { useEffect, useState } from 'react';
import type { ThemeMode } from '@/types';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as ThemeMode | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (systemDark ? 'dark' : 'light');
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(t: ThemeMode) {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  function toggleTheme() {
    const next: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
    localStorage.setItem('theme', next);
  }

  return { theme, toggleTheme, mounted };
}
