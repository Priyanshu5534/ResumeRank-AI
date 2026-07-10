'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user', { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          setState({ user: json.data, loading: false });
        } else {
          setState({ user: null, loading: false });
        }
      } catch {
        setState({ user: null, loading: false });
      }
    }
    fetchUser();
  }, []);

  return state;
}
