'use client';

import { colors, borderRadius } from '@/styles/theme';
import { LeagueTier } from '@/types';

interface LeagueProgressProps {
  tier: LeagueTier;
  progress: number; // 0-100
}

const tierColors: Record<LeagueTier, string> = {
  Apex: colors.league.apex,
  Diamond: colors.league.diamond,
  Gold: colors.league.gold,
  Silver: colors.league.silver,
  Bronze: colors.league.bronze,
};

export default function LeagueProgress({ tier, progress }: LeagueProgressProps) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            {tier} League
          </span>
          <span className="text-lg">🏆</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.track }}
      >
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${colors.primary.blue} 0%, ${colors.primary.accent} 100%)`,
          }}
        />
      </div>
      
      <p className="text-xs mt-1" style={{ color: colors.text.secondary }}>
        {progress}% to next promotion
      </p>
    </div>
  );
}
