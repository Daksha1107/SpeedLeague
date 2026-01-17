'use client';

import { motion } from 'framer-motion';
import { colors, components, measurements } from '@/styles/theme';
import { User } from 'lucide-react';

interface LeaderboardRowProps {
  rank: number;
  name: string;
  reactionTime: number;
  isCurrentUser?: boolean;
  delay?: number;
}

export default function LeaderboardRow({ 
  rank, 
  name, 
  reactionTime, 
  isCurrentUser = false,
  delay = 0,
}: LeaderboardRowProps) {
  const isTopRank = rank === 1;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-4 px-4 py-3 rounded-2xl border"
      style={{
        height: measurements.leaderboard.rowHeight,
        backgroundColor: isCurrentUser 
          ? 'rgba(0, 180, 255, 0.1)' 
          : colors.background.cardTransparent,
        borderColor: isTopRank 
          ? colors.primary.accent 
          : isCurrentUser
          ? colors.primary.blue
          : colors.border,
        boxShadow: isTopRank 
          ? `0 0 20px ${colors.primary.accent}40`
          : components.card.shadow,
      }}
    >
      {/* Rank Number */}
      <div 
        className="flex items-center justify-center font-bold text-lg"
        style={{
          width: '32px',
          color: isTopRank ? colors.primary.accent : colors.text.primary,
        }}
      >
        {rank}
      </div>

      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: measurements.leaderboard.avatarSize,
          height: measurements.leaderboard.avatarSize,
          backgroundColor: 'rgba(100, 116, 139, 0.2)',
        }}
      >
        <User size={20} color={colors.text.secondary} />
      </div>

      {/* Name */}
      <div className="flex-1">
        <p className="text-base font-semibold text-white">
          {name}
        </p>
      </div>

      {/* Reaction Time */}
      <div className="text-right">
        <p 
          className="text-lg font-bold"
          style={{ color: colors.primary.accent }}
        >
          {reactionTime}ms
        </p>
      </div>
    </motion.div>
  );
}
