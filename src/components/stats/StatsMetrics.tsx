'use client';

import { colors, components } from '@/styles/theme';

interface StatsMetricsProps {
  average: number;
  totalPlays: number;
}

export default function StatsMetrics({ average, totalPlays }: StatsMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Average */}
      <div
        className="px-4 py-5 rounded-2xl border text-center"
        style={{
          backgroundColor: colors.background.cardTransparent,
          borderColor: colors.border,
          boxShadow: components.card.shadow,
        }}
      >
        <p className="text-xs mb-2" style={{ color: colors.text.secondary }}>
          Average
        </p>
        <p className="text-2xl font-bold text-white">
          {average}ms
        </p>
      </div>

      {/* Total Plays */}
      <div
        className="px-4 py-5 rounded-2xl border text-center"
        style={{
          backgroundColor: colors.background.cardTransparent,
          borderColor: colors.border,
          boxShadow: components.card.shadow,
        }}
      >
        <p className="text-xs mb-2" style={{ color: colors.text.secondary }}>
          Total Plays
        </p>
        <p className="text-2xl font-bold text-white">
          {totalPlays}
        </p>
      </div>
    </div>
  );
}
