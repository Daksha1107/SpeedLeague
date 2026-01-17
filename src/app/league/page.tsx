'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScreenContainer from '@/components/layout/ScreenContainer';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import LeagueLadder from '@/components/league/LeagueLadder';
import { UserStats, LeagueTier } from '@/types';
import { colors } from '@/styles/theme';

export default function LeaguePage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('speedleague_user_id');
    if (!storedUserId) {
      router.push('/');
      return;
    }
    fetchStats(storedUserId);
  }, [router]);

  const fetchStats = async (uid: string) => {
    try {
      const response = await fetch(`/api/stats/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <p style={{ color: colors.text.secondary }}>Loading league...</p>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  const currentLeague: LeagueTier = stats?.currentLeague || 'Gold';

  return (
    <ScreenContainer>
      <TopBar title="League" showBack={true} />

      <div className="py-6">
        {/* League Ladder */}
        <LeagueLadder currentLeague={currentLeague} />

        {/* Season Info */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            Season Ends in <span className="font-bold text-white">2 Days</span>
          </p>
        </div>
      </div>

      <BottomNav />
    </ScreenContainer>
  );
}
