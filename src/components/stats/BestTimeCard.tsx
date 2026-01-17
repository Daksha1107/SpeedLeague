'use client';

import { colors, components } from '@/styles/theme';

interface BestTimeCardProps {
  time: number;
}

export default function BestTimeCard({ time }: BestTimeCardProps) {
  return (
    <div
      className="px-6 py-5 rounded-2xl border flex items-center justify-between"
      style={{
        backgroundColor: colors.background.cardTransparent,
        borderColor: colors.border,
        boxShadow: components.card.shadow,
      }}
    >
      <div>
        <p className="text-sm mb-1" style={{ color: colors.text.secondary }}>
          Best Reaction Time:
        </p>
        <p className="text-4xl font-bold" style={{ color: colors.primary.accent }}>
          {time}ms
        </p>
      </div>
    </div>
  );
}
