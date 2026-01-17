'use client';

import { ReactNode } from 'react';
import { colors, components } from '@/styles/theme';

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function StatsCard({ icon, label, value }: StatsCardProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
      style={{
        backgroundColor: colors.background.cardTransparent,
        borderColor: colors.border,
        boxShadow: components.card.shadow,
      }}
    >
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ backgroundColor: 'rgba(0, 180, 255, 0.1)' }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs" style={{ color: colors.text.secondary }}>
          {label}
        </p>
        <p className="text-lg font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}
