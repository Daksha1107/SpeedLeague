'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { colors, measurements } from '@/styles/theme';

interface CircularProgressProps {
  reactionTime: number;
  percentile: number;
}

export default function CircularProgress({ reactionTime, percentile }: CircularProgressProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate progress based on percentile (inverted - top % is better)
  const progress = percentile / 100;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative" style={{ width: `${size}px`, height: `${size}px` }}>
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{
            background: `radial-gradient(circle, ${colors.primary.accent} 0%, transparent 70%)`,
          }}
        />
        
        {/* SVG Circle */}
        <svg width={size} height={size} className="relative transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.track}
            strokeWidth={strokeWidth}
          />
          
          {/* Progress Circle with Gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary.blue} />
              <stop offset="100%" stopColor={colors.primary.blueLight} />
            </linearGradient>
          </defs>
          
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.primary.accent})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-6xl font-bold text-white">
                {reactionTime}
              </span>
              <span className="text-2xl font-semibold ml-1" style={{ color: colors.text.secondary }}>
                ms
              </span>
            </div>
            <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
              Top {Math.round(percentile)}% today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
