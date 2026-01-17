'use client';

import { motion } from 'framer-motion';

interface GaugeRingProps {
  value: number;
  percentile: number;
}

export default function GaugeRing({ value, percentile }: GaugeRingProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div 
        className="w-[240px] h-[240px] rounded-full soft-inset flex items-center justify-center relative"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        
        {/* Conic gradient ring */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 20deg, 
              rgba(27,182,255,0) 0%, 
              rgba(27,182,255,0) ${percentile}%, 
              rgba(27,182,255,1) ${percentile}%, 
              rgba(27,182,255,1) ${percentile + 15}%, 
              rgba(27,182,255,0) ${percentile + 15}%,
              rgba(27,182,255,0) 100%
            )`,
            filter: "drop-shadow(0px 0px 18px rgba(27,182,255,0.35))",
          }}
        />
        
        {/* Center content */}
        <div className="relative text-center z-10">
          <div className="text-6xl font-bold text-white">
            {value}
            <span className="text-xl font-medium text-white/70">ms</span>
          </div>
          <div className="text-white/60 text-sm mt-1">
            Top {percentile}% today
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Export as GaugeRing with alias for backward compatibility
export { GaugeRing as CircularProgress };
