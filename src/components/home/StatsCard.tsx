'use client';

import { ReactNode } from 'react';

interface StatPillProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function StatPill({ icon, label, value }: StatPillProps) {
  return (
    <div className="soft-card px-4 py-3 flex items-center gap-3">
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-full"
        style={{ backgroundColor: 'rgba(27, 182, 255, 0.1)' }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-[var(--muted)]">
          {label}
        </p>
        <p className="text-lg font-bold text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

// Export as StatPill with alias for backward compatibility
export { StatPill as StatsCard };
