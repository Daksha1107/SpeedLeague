'use client';

import { LeagueTier as LeagueTierType } from '@/types';

interface LeagueTierProps {
  tier: LeagueTierType;
  color: 'apex' | 'diamond' | 'gold' | 'silver' | 'bronze';
  active?: boolean;
  label?: string;
}

const colorMap = {
  apex: 'var(--apex)',
  diamond: 'var(--diamond)',
  gold: 'var(--gold)',
  silver: 'var(--silver)',
  bronze: 'var(--bronze)',
};

export default function LeagueTier({ 
  tier, 
  color, 
  active = false,
  label 
}: LeagueTierProps) {
  return (
    <div className="relative">
      <div 
        className={`soft-card px-6 py-4 flex items-center justify-center rounded-full ${
          active ? 'glow-gold scale-105' : ''
        }`}
        style={{
          background: active 
            ? `linear-gradient(90deg, ${colorMap[color]}, ${colorMap[color]}dd)`
            : 'rgba(255,255,255,0.02)'
        }}
      >
        <span className="text-white font-semibold">{tier}</span>
      </div>
      
      {label && (
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-[var(--blue)] text-xs whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}
