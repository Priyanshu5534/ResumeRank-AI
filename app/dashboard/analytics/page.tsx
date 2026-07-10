'use client';

import * as React from 'react';
import { BarChart3, TrendingUp, Users, Award, Briefcase } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DashboardCard from '@/components/dashboard/DashboardCard';
import ApplicationsChart from '@/components/dashboard/ApplicationsChart';
import JobStatusChart from '@/components/dashboard/JobStatusChart';
import MonthlyHiringChart from '@/components/dashboard/MonthlyHiringChart';
import { DashboardSkeleton } from '@/components/ui/loader';

export default function AnalyticsPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await fetch('/api/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (e) {
        console.error('Analytics load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <div>Error loading analytics insights.</div>;

  const { stats, jobsByStatus, monthlyHiring, applicationTrend, skillDistribution } = data;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-2">
          Hiring Analytics & Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          In-depth recruitment metrics, talent acquisition velocity, and skill match breakdowns.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Positions"
          value={stats.totalJobs}
          icon={Briefcase}
          color="bg-blue-600"
          subtitle="Lifetime postings"
        />
        <DashboardCard
          title="Applicant Pool"
          value={stats.totalCandidates}
          icon={Users}
          color="bg-emerald-600"
          subtitle="All received applications"
        />
        <DashboardCard
          title="AI Evaluation Rate"
          value={`${stats.totalCandidates ? Math.round((stats.aiRanked / stats.totalCandidates) * 100) : 0}%`}
          icon={Award}
          color="bg-purple-600"
          subtitle={`${stats.aiRanked} resumes analyzed`}
        />
        <DashboardCard
          title="Average Quality Score"
          value={`${stats.averageScore}%`}
          icon={TrendingUp}
          color="bg-amber-600"
          subtitle="Mean candidate match"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ApplicationsChart data={applicationTrend} />
        <JobStatusChart data={jobsByStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyHiringChart data={monthlyHiring} />

        {/* Top Demanded Skills extracted from candidate resumes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Candidate Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {!skillDistribution || skillDistribution.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-sm text-slate-400">
                No skill data extracted yet
              </div>
            ) : (
              <div className="space-y-3">
                {skillDistribution.map((sk: any, i: number) => {
                  const maxCount = skillDistribution[0]?.count || 1;
                  const pct = Math.round((sk.count / maxCount) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{sk.name}</span>
                        <span>{sk.count} candidates</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}