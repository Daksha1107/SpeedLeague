'use client';

import { LeagueTier as LeagueTierType } from '@/types';
import LeagueTier from './LeagueTier';
import { measurements } from '@/styles/theme';

interface LeagueLadderProps {
  currentLeague: LeagueTierType;
}

const allTiers: LeagueTierType[] = ['Apex', 'Diamond', 'Gold', 'Silver', 'Bronze'];

export default function LeagueLadder({ currentLeague }: LeagueLadderProps) {
  return (
    <div className="space-y-6 py-6">
      {allTiers.map((tier, index) => {
        const isCurrent = tier === currentLeague;
        const currentIndex = allTiers.indexOf(currentLeague);
        const tierIndex = allTiers.indexOf(tier);
        
        // Show up arrow if can be promoted to this tier
        const showUpArrow = isCurrent && tierIndex > 0;
        // Show down arrow if can be demoted to this tier
        const showDownArrow = isCurrent && tierIndex < allTiers.length - 1;
        
        return (
          <LeagueTier
            key={tier}
            tier={tier}
            isCurrent={isCurrent}
            showUpArrow={showUpArrow}
            showDownArrow={showDownArrow}
            delay={index * 0.1}
          />
        );
      })}
    </div>
  );
}
