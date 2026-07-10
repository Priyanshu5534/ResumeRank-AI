'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MonthlyHiringChartProps {
  data: { month: string; hired: number }[];
}

export default function MonthlyHiringChart({ data }: MonthlyHiringChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.hired, 0);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Monthly Hires Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          {total === 0 && data.every(d => d.hired === 0) ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              No hires made in the last 6 months
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="hired"
                  name="Selected Candidates"
                  fill="#10b981" // Emerald-500
                  radius={[4, 4, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
