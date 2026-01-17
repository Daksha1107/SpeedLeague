'use client';

import { LeagueTier } from '@/types';

interface LeagueProgressProps {
  tier: LeagueTier;
  progress: number; // 0-100
}

const tierColors: Record<LeagueTier, string> = {
  Apex: 'var(--apex)',
  Diamond: 'var(--diamond)',
  Gold: 'var(--gold)',
  Silver: 'var(--silver)',
  Bronze: 'var(--bronze)',
};

export default function LeagueProgress({ tier, progress }: LeagueProgressProps) {
  return (
    <div className="soft-card p-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            {tier} League
          </span>
          <span className="text-lg">🏆</span>
        </div>
        <span className="text-xs text-[var(--muted)]">
          {progress}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full h-3 rounded-full overflow-hidden bg-[rgba(255,255,255,0.05)]">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full glow-blue"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, var(--blue2), var(--blue))`,
            }}
          />
        </div>
      </div>
      
      <p className="text-xs mt-2 text-[var(--muted)]">
        {100 - progress}% to next promotion
      </p>
    </div>
  );
}
