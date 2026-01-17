'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PrimaryButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function PrimaryButton({ 
  onClick, 
  disabled = false, 
  children = "PLAY DUEL",
  className = ""
}: PrimaryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02, filter: 'brightness(1.1)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`w-full text-white text-lg font-semibold rounded-2xl glow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{
        height: '56px',
        background: disabled 
          ? 'rgba(255,255,255,0.1)' 
          : 'linear-gradient(90deg, var(--blue2), var(--blue))',
      }}
    >
      {children}
    </motion.button>
  );
}

// Export as PrimaryButton with alias for backward compatibility
export { PrimaryButton as PlayButton };
