'use client';

import { ChevronDown } from 'lucide-react';
import { LeagueTier as LeagueTierType } from '@/types';
import LeagueTier from './LeagueTier';

interface LeagueLadderProps {
  currentLeague: LeagueTierType;
}

const allTiers: { tier: LeagueTierType; color: 'apex' | 'diamond' | 'gold' | 'silver' | 'bronze' }[] = [
  { tier: 'Apex', color: 'apex' },
  { tier: 'Diamond', color: 'diamond' },
  { tier: 'Gold', color: 'gold' },
  { tier: 'Silver', color: 'silver' },
  { tier: 'Bronze', color: 'bronze' },
];

export default function LeagueLadder({ currentLeague }: LeagueLadderProps) {
  return (
    <div className="space-y-4 py-6">
      {allTiers.map(({ tier, color }, index) => {
        const isCurrent = tier === currentLeague;
        
        return (
          <div key={tier}>
            <LeagueTier
              tier={tier}
              color={color}
              active={isCurrent}
              label={isCurrent ? 'Current League' : undefined}
            />
            {index < allTiers.length - 1 && (
              <div className="flex justify-center my-4">
                <ChevronDown className="text-white/30" size={16} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
