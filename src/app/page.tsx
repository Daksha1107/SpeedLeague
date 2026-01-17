'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Flame } from 'lucide-react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import CircularProgress from '@/components/home/CircularProgress';
import StatsCard from '@/components/home/StatsCard';
import LeagueProgress from '@/components/home/LeagueProgress';
import PlayButton from '@/components/home/PlayButton';
import { UserStats } from '@/types';
import { generateUserId } from '@/lib/utils';
import { colors } from '@/styles/theme';

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get or create user ID
    let storedUserId = localStorage.getItem('speedleague_user_id');
    if (!storedUserId) {
      storedUserId = generateUserId();
      localStorage.setItem('speedleague_user_id', storedUserId);
    }
    setUserId(storedUserId);

    // Fetch user stats
    fetchStats(storedUserId);
  }, []);

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

  const handlePlayDuel = () => {
    router.push('/duel');
  };

  if (loading) {
    return (
      <ScreenContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <p style={{ color: colors.text.secondary }}>Loading...</p>
          </div>
        </div>
      </ScreenContainer>
    );
  }

  const attemptsUsed = stats ? (stats.attemptsRemaining >= 3 ? 0 : 3 - stats.attemptsRemaining) : 0;
  const totalAttempts = 3 + (stats && stats.currentStreak >= 7 ? 2 : stats && stats.currentStreak >= 3 ? 1 : 0);
  const reactionTime = stats?.dailyBest || 187;
  const percentile = 88; // Top 12% = 88th percentile

  return (
    <ScreenContainer>
      <TopBar 
        title="Reflex Duel" 
        showHome={true}
        showSettings={true}
      />

      <div className="py-6 space-y-6">
        {/* Circular Progress */}
        <CircularProgress 
          reactionTime={reactionTime}
          percentile={percentile}
        />

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            icon={<RefreshCw size={20} color={colors.primary.accent} />}
            label="Attempts"
            value={`${attemptsUsed}/${totalAttempts}`}
          />
          <StatsCard
            icon={<Flame size={20} color="#F59E0B" />}
            label="Streak"
            value={`${stats?.currentStreak || 5} days`}
          />
        </div>

        {/* League Progress */}
        {stats?.currentLeague && (
          <LeagueProgress 
            tier={stats.currentLeague}
            progress={70}
          />
        )}

        {/* Play Button */}
        <PlayButton
          onClick={handlePlayDuel}
          disabled={stats?.attemptsRemaining === 0}
          attemptsRemaining={stats?.attemptsRemaining}
        />
      </div>

      <BottomNav />
    </ScreenContainer>
  );
}
