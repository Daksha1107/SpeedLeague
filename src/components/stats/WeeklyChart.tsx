'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { colors, components } from '@/styles/theme';

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
    <div
      className="p-6 rounded-2xl border"
      style={{
        backgroundColor: colors.background.cardTransparent,
        borderColor: colors.border,
        boxShadow: components.card.shadow,
      }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">Weekly Improvement</h3>
      
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.primary.accent} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.primary.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colors.border} 
            vertical={false}
          />
          
          <XAxis 
            dataKey="day" 
            stroke={colors.text.secondary}
            tick={{ fill: colors.text.secondary, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: colors.border }}
          />
          
          <YAxis 
            stroke={colors.text.secondary}
            tick={{ fill: colors.text.secondary, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: colors.border }}
            domain={[150, 180]}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: colors.background.card,
              border: `1px solid ${colors.border}`,
              borderRadius: '8px',
              color: colors.text.primary,
            }}
            labelStyle={{ color: colors.text.secondary }}
            cursor={{ stroke: colors.primary.accent, strokeWidth: 1 }}
          />
          
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors.primary.accent}
            strokeWidth={3}
            dot={{ fill: colors.primary.accent, r: 5 }}
            activeDot={{ r: 7, fill: colors.primary.blue }}
            fill="url(#lineGradient)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
