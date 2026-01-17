'use client';

import { Chip } from '@nextui-org/react';
import { LeagueTier } from '@/types';
import { getLeagueTierIcon } from '@/lib/utils';

interface LeagueBadgeProps {
  tier: LeagueTier;
  size?: 'sm' | 'md' | 'lg';
}

export default function LeagueBadge({ tier, size = 'md' }: LeagueBadgeProps) {
  const getTierColor = (tier: LeagueTier) => {
    switch (tier) {
      case 'Apex':
        return 'danger';
      case 'Diamond':
        return 'secondary';
      case 'Gold':
        return 'warning';
      case 'Silver':
        return 'default';
      case 'Bronze':
        return 'default';
      default:
        return 'default';
    }
  };

  const icon = getLeagueTierIcon(tier);

  return (
    <Chip
      color={getTierColor(tier)}
      size={size}
      variant="flat"
      className="font-bold"
    >
      {icon} {tier}
    </Chip>
  );
}
