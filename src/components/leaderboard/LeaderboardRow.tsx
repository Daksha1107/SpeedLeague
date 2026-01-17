'use client';

import { motion } from 'framer-motion';
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
      className={`soft-card px-4 py-3 flex items-center gap-3 ${
        isCurrentUser ? 'glow-blue' : ''
      }`}
    >
      {/* Rank Number */}
      <div 
        className="flex items-center justify-center font-semibold text-sm w-6"
        style={{
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {rank}
      </div>

      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full overflow-hidden w-10 h-10"
        style={{
          backgroundColor: 'rgba(100, 116, 139, 0.2)',
        }}
      >
        <User size={20} color="rgba(255,255,255,0.6)" />
      </div>

      {/* Name */}
      <div className="flex-1 text-white font-medium">
        {name}
      </div>

      {/* Reaction Time */}
      <div className="text-[var(--blue)] font-semibold">
        {reactionTime}ms
      </div>
    </motion.div>
  );
}
