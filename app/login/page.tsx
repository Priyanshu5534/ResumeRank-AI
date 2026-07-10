'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        toast.success('Welcome back to ResumeRank AI!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(json.error || 'Invalid credentials');
      }
    } catch {
      toast.error('Network error during sign in.');
    } finally {
      setLoading(false);
    }
  }

  async function fillDemoAndLogin() {
    setEmail('demo@resumerank.ai');
    setPassword('demo123456');
    // auto register/login demo user
    setLoading(true);
    try {
      // First try login
      let res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@resumerank.ai', password: 'demo123456' }),
      });
      if (!res.ok) {
        // Create demo account if it doesn't exist yet
        res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Alex Rivera (Demo Recruiter)',
            email: 'demo@resumerank.ai',
            password: 'demo123456',
          }),
        });
      }

      if (res.ok) {
        toast.success('Signed in as Demo Recruiter!');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error('Could not sign in demo account.');
      }
    } catch {
      toast.error('Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              ResumeRank AI
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 pt-2">
            Sign in to your ATS portal
          </h2>
          <p className="text-xs text-slate-500">
            Automated resume ranking and recruiter dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="recruiter@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" loading={loading} className="w-full py-2.5 mt-2">
            Sign In
          </Button>
        </form>

        {/* Quick Demo button */}
        <div className="pt-2">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-semibold">
                Instant Testing
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            loading={loading}
            onClick={fillDemoAndLogin}
            className="w-full flex items-center justify-center gap-2 border-dashed border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Demo Recruiter Login
          </Button>
        </div>

        {/* Register redirect link */}
        <p className="text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-bold text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}