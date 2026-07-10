'use client';

import * as React from 'react';
import { Briefcase, Users, FileText, BarChart3, Star, Sparkles } from 'lucide-react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { DashboardSkeleton } from '@/components/ui/loader';
import ApplicationsChart from '@/components/dashboard/ApplicationsChart';
import JobStatusChart from '@/components/dashboard/JobStatusChart';
import MonthlyHiringChart from '@/components/dashboard/MonthlyHiringChart';
import RecentJobsTable from '@/components/dashboard/RecentJobsTable';
import TopCandidates from '@/components/dashboard/TopCandidates';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';

export default function DashboardPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <div>Failed to load data.</div>;

  const { stats, jobsByStatus, monthlyHiring, applicationTrend, recentJobs, topCandidates, recentActivity } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Greeting Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your recruitment funnel, job postings, and AI resume rankings in real-time.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <DashboardCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon={Briefcase}
          color="bg-blue-600 shadow-blue-500/10"
          subtitle="All created job positions"
        />
        <DashboardCard
          title="Open Jobs"
          value={stats.openJobs}
          icon={Sparkles}
          color="bg-indigo-600 shadow-indigo-500/10"
          subtitle="Currently active hirings"
        />
        <DashboardCard
          title="Candidates"
          value={stats.totalCandidates}
          icon={Users}
          color="bg-emerald-600 shadow-emerald-500/10"
          subtitle={`+${stats.newThisWeek.candidates} this week`}
        />
        <DashboardCard
          title="AI Ranked"
          value={stats.aiRanked}
          icon={FileText}
          color="bg-purple-600 shadow-purple-500/10"
          subtitle={`${stats.totalCandidates ? Math.round((stats.aiRanked / stats.totalCandidates) * 100) : 0}% processed`}
        />
        <DashboardCard
          title="Avg Match"
          value={`${stats.averageScore}%`}
          icon={BarChart3}
          color="bg-amber-600 shadow-amber-500/10"
          subtitle="Avg score of applicants"
        />
      </div>

      {/* Recharts Graphics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ApplicationsChart data={applicationTrend} />
        <JobStatusChart data={jobsByStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyHiringChart data={monthlyHiring} />
        <TopCandidates candidates={topCandidates} />
      </div>

      {/* Recent Tables & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentJobsTable jobs={recentJobs} />
        <ActivityTimeline activities={recentActivity} />
      </div>
    </div>
  );
}