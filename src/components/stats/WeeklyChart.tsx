'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ChartData {
  day: string;
  value: number;
}

interface WeeklyChartProps {
  data?: ChartData[];
}

const defaultData: ChartData[] = [
  { day: 'Sun', value: 165 },
  { day: 'Mon', value: 153 },
  { day: 'Tue', value: 175 },
  { day: 'Wed', value: 170 },
  { day: 'Thu', value: 162 },
  { day: 'Fri', value: 170 },
  { day: 'Sat', value: 175 },
];

export default function WeeklyChart({ data = defaultData }: WeeklyChartProps) {
  return (
    <div className="soft-card p-6">
      <div className="text-white font-semibold mb-4">Weekly Improvement</div>
      
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--blue)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--blue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="day" 
            stroke="rgba(255,255,255,0.3)" 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)" 
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="var(--blue)" 
            strokeWidth={2}
            fill="url(#lineGradient)"
            dot={{ fill: 'var(--blue)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
