'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Trophy, BarChart3, Shield, LucideIcon } from 'lucide-react';
import { colors, components } from '@/styles/theme';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

const tabs: Tab[] = [
  { id: 'home', label: 'Home', icon: Home, href: '/' },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, href: '/leaderboard' },
  { id: 'stats', label: 'Stats', icon: BarChart3, href: '/stats' },
  { id: 'league', label: 'League', icon: Shield, href: '/league' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 backdrop-blur-lg border-t border-white/10"
      style={{
        height: components.bottomNav.height,
        backgroundColor: colors.background.primary,
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.href);
        
        return (
          <button
            key={tab.id}
            onClick={() => router.push(tab.href)}
            className="flex flex-col items-center justify-center gap-1 transition-all duration-300"
            style={{
              color: active ? components.bottomNav.activeColor : components.bottomNav.inactiveColor,
            }}
          >
            <Icon
              size={Number(components.bottomNav.iconSize)}
              className="transition-transform duration-300"
              style={{
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}
            />
            <span
              className="text-xs font-medium"
              style={{
                opacity: active ? 1 : 0.7,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
