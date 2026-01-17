'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Trophy, BarChart3, Shield, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-3 soft-card rounded-3xl mx-auto"
      style={{
        maxWidth: '420px',
        height: '72px',
        background: 'var(--panel)',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab.href);
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => router.push(tab.href)}
            className="flex flex-col items-center justify-center gap-1 transition-all duration-300"
            whileTap={{ scale: 0.95 }}
            style={{
              color: active ? 'white' : 'rgba(255,255,255,0.6)',
            }}
          >
            <motion.div
              animate={{ scale: active ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={24} />
            </motion.div>
            <span
              className="text-xs font-medium"
              style={{
                opacity: active ? 1 : 0.7,
              }}
            >
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
