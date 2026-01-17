'use client';

import { colors } from '@/styles/theme';

interface LeaderboardTabsProps {
  activeTab: 'global' | 'country';
  onTabChange: (tab: 'global' | 'country') => void;
}

export default function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onTabChange('global')}
        className="flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-all relative"
        style={{
          color: activeTab === 'global' ? colors.primary.accent : colors.text.secondary,
        }}
      >
        GLOBAL
        {activeTab === 'global' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
            style={{ backgroundColor: colors.primary.accent }}
          />
        )}
      </button>
      
      <button
        onClick={() => onTabChange('country')}
        className="flex-1 py-3 text-sm font-bold uppercase tracking-wide transition-all relative"
        style={{
          color: activeTab === 'country' ? colors.primary.accent : colors.text.secondary,
        }}
      >
        COUNTRY
        {activeTab === 'country' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
            style={{ backgroundColor: colors.primary.accent }}
          />
        )}
      </button>
    </div>
  );
}
