'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface JobStatusChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#2563eb', '#ef4444', '#f59e0b']; // Blue (OPEN), Red (CLOSED), Yellow (DRAFT)

export default function JobStatusChart({ data }: JobStatusChartProps) {
  // Format labels nicely
  const formattedData = data.map((d) => ({
    name: d.name.charAt(0) + d.name.slice(1).toLowerCase(),
    value: d.value,
  }));

  const total = formattedData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Job Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-80">
        <div className="h-60 w-full relative">
          {total === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400">
              No jobs created yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-500">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
