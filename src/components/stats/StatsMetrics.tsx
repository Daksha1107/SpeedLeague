'use client';

interface StatsMetricsProps {
  average: number;
  totalPlays: number;
}

export default function StatsMetrics({ average, totalPlays }: StatsMetricsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Average */}
      <div className="soft-card p-4">
        <div className="text-white/60 text-xs">Average:</div>
        <div className="text-white text-2xl font-bold mt-1">{average}ms</div>
      </div>

      {/* Total Plays */}
      <div className="soft-card p-4">
        <div className="text-white/60 text-xs">Total Plays:</div>
        <div className="text-white text-2xl font-bold mt-1">{totalPlays}</div>
      </div>
    </div>
  );
}
