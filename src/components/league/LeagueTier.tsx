'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { colors, measurements } from '@/styles/theme';
import { LeagueTier as LeagueTierType } from '@/types';

interface LeagueTierProps {
  tier: LeagueTierType;
  isCurrent?: boolean;
  showUpArrow?: boolean;
  showDownArrow?: boolean;
  delay?: number;
}

const tierColors: Record<LeagueTierType, string> = {
  Apex: colors.league.apex,
  Diamond: colors.league.diamond,
  Gold: colors.league.gold,
  Silver: colors.league.silver,
  Bronze: colors.league.bronze,
};

const tierGradients: Record<LeagueTierType, string> = {
  Apex: `linear-gradient(90deg, ${colors.league.apex} 0%, #8B5CF6 100%)`,
  Diamond: `linear-gradient(90deg, ${colors.league.diamond} 0%, #3B82F6 100%)`,
  Gold: `linear-gradient(90deg, ${colors.league.gold} 0%, #F59E0B 100%)`,
  Silver: `linear-gradient(90deg, ${colors.league.silver} 0%, #6B7280 100%)`,
  Bronze: `linear-gradient(90deg, ${colors.league.bronze} 0%, #92400E 100%)`,
};

export default function LeagueTier({ 
  tier, 
  isCurrent = false, 
  showUpArrow = false,
  showDownArrow = false,
  delay = 0,
}: LeagueTierProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ scale: 1.02 }}
        className="relative rounded-full px-8 py-4 border flex items-center justify-between transition-all"
        style={{
          height: measurements.league.tierCardHeight,
          background: isCurrent ? tierGradients[tier] : colors.background.cardTransparent,
          borderColor: isCurrent ? tierColors[tier] : colors.border,
          boxShadow: isCurrent 
            ? `0 0 30px ${tierColors[tier]}50`
            : 'none',
          transform: isCurrent ? `scale(${measurements.league.currentScale})` : 'scale(1)',
        }}
      >
        {/* Tier Name */}
        <div className="flex items-center gap-3">
          {showUpArrow && (
            <ChevronUp size={measurements.league.arrowSize} color={colors.text.secondary} />
          )}
          <span 
            className="text-xl font-bold"
            style={{ 
              color: isCurrent ? colors.background.primary : colors.text.primary,
            }}
          >
            {tier}
          </span>
          {showDownArrow && (
            <ChevronDown size={measurements.league.arrowSize} color={colors.text.secondary} />
          )}
        </div>

        {/* Current League Label */}
        {isCurrent && (
          <span 
            className="text-xs font-semibold"
            style={{ color: colors.primary.accent }}
          >
            Current League
          </span>
        )}
      </motion.div>
    </div>
  );
}
