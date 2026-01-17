'use client';

interface BestTimeCardProps {
  time: number;
}

export default function BestTimeCard({ time }: BestTimeCardProps) {
  return (
    <div className="soft-card p-6">
      <div className="text-white/60 text-sm">Best Reaction Time:</div>
      <div className="text-[var(--blue)] text-4xl font-bold mt-2">{time}ms</div>
    </div>
  );
}
