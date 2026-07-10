'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Sun, Moon, Key, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme, mounted } = useTheme();

  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCompany(user.company || '');
      setTitle(user.title || '');
    }
  }, [user]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, title }),
      });
      if (res.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to save profile changes');
      }
    } catch {
      toast.error('Network error updating profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Account & Platform Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure your recruiter profile, manage visual preferences, and verify AI engine settings.
        </p>
      </div>

      {/* Recruiter Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Recruiter Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email address cannot be changed."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company / Organization"
                placeholder="e.g. Acme Tech Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <Input
                label="Role / Title"
                placeholder="e.g. Lead Technical Recruiter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" loading={loading}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* AI Engine Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            AI Evaluation Engine Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-sm font-bold text-slate-850 dark:text-slate-100">
                Active Generative AI Provider
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Powered by Google Gemini Large Language Model
              </p>
            </div>
            <Badge variant="success" className="px-3 py-1 text-xs">
              Gemini 2.5 Flash • Active
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-slate-850 dark:text-slate-100">
                  GEMINI_API_KEY Connection
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Environment key loaded via server-side secure env configuration
                </p>
              </div>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      {mounted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Appearance & Mode</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Theme Mode</p>
              <p className="text-xs text-slate-500">Switch between sleek Light and dark glassmorphic UI.</p>
            </div>
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="flex items-center gap-2"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-blue-500" /> Dark Mode
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}