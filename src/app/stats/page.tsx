'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import BestTimeCard from '@/components/stats/BestTimeCard';
import WeeklyChart from '@/components/stats/WeeklyChart';
import StatsMetrics from '@/components/stats/StatsMetrics';
import { UserStats } from '@/types';

export default function StatsPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('speedleague_user_id');
    if (!storedUserId) {
      router.push('/');
      return;
    }
    setUserId(storedUserId);
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
      <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div className="mx-auto max-w-[420px] px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-[var(--muted)]">Loading stats...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="mx-auto max-w-[420px] px-4 pt-6 pb-24">
        
        <TopBar title="Stats" showMenu={false} />
        
        {/* Best Time Card */}
        <div className="mt-6">
          <BestTimeCard time={stats?.allTimeBest || 156} />
        </div>
        
        {/* Weekly Chart */}
        <div className="mt-6">
          <WeeklyChart />
        </div>
        
        {/* Stats Summary */}
        <div className="mt-6">
          <StatsMetrics 
            average={175}
            totalPlays={450}
          />
        </div>
      </div>
      
      <BottomNav />
    </main>
  );
}
