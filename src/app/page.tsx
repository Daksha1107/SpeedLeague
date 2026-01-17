'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Flame } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import GaugeRing from '@/components/home/CircularProgress';
import StatPill from '@/components/home/StatsCard';
import LeagueProgress from '@/components/home/LeagueProgress';
import PrimaryButton from '@/components/home/PlayButton';
import { UserStats } from '@/types';
import { generateUserId } from '@/lib/utils';

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
      <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div className="mx-auto max-w-[420px] px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⚡</div>
            <p className="text-[var(--muted)]">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  const attemptsUsed = stats ? (stats.attemptsRemaining >= 3 ? 0 : 3 - stats.attemptsRemaining) : 0;
  const totalAttempts = 3 + (stats && stats.currentStreak >= 7 ? 2 : stats && stats.currentStreak >= 3 ? 1 : 0);
  
  // Demo values - replace with actual data when available
  const reactionTime = stats?.dailyBest || 187;
  const percentile = 12; // Top 12%

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="mx-auto max-w-[420px] px-4 pt-6 pb-24">
        
        {/* TopBar */}
        <TopBar />
        
        {/* Main Card */}
        <div className="mt-8 soft-card p-6">
          
          {/* Gauge Ring */}
          <GaugeRing 
            value={reactionTime}
            percentile={percentile}
          />
          
          {/* Stat Pills */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <StatPill
              icon={<RefreshCw size={20} color="var(--blue)" />}
              label="Attempts"
              value={`${attemptsUsed}/${totalAttempts}`}
            />
            <StatPill
              icon={<Flame size={20} color="#F59E0B" />}
              label="Streak"
              value={`${stats?.currentStreak || 5} days`}
            />
          </div>
          
          {/* League Progress */}
          {stats?.currentLeague && (
            <LeagueProgress 
              tier={stats.currentLeague}
              progress={62}
            />
          )}
          
          {/* CTA Button */}
          <PrimaryButton
            onClick={handlePlayDuel}
            disabled={stats?.attemptsRemaining === 0}
            className="mt-6"
          >
            PLAY DUEL
          </PrimaryButton>
          
        </div>
      </div>
      
      <BottomNav />
    </main>
  );
}
