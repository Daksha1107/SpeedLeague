'use client';

import { ReactNode } from 'react';
import { colors, layout } from '@/styles/theme';

interface ScreenContainerProps {
  children: ReactNode;
  className?: string;
}

export default function ScreenContainer({ children, className = '' }: ScreenContainerProps) {
  return (
    <div
      className={`min-h-screen pb-24 ${className}`}
      style={{
        backgroundColor: colors.background.primary,
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: layout.maxWidth,
          padding: `0 ${layout.paddingHorizontal}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
