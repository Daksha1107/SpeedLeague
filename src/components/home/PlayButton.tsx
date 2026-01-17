'use client';

import { motion } from 'framer-motion';
import { colors, components } from '@/styles/theme';

interface PlayButtonProps {
  onClick: () => void;
  disabled?: boolean;
  attemptsRemaining?: number;
}

export default function PlayButton({ onClick, disabled = false, attemptsRemaining }: PlayButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className="w-full text-white text-lg font-bold rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        height: components.button.primary.height,
        background: disabled ? colors.track : components.button.primary.gradient,
        boxShadow: disabled ? 'none' : `0 8px 24px ${colors.primary.blue}40`,
      }}
    >
      PLAY DUEL
    </motion.button>
  );
}
