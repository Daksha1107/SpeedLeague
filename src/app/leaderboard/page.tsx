'use client';

import { useState, useEffect } from 'react';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import LeaderboardTabs from '@/components/leaderboard/LeaderboardTabs';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import { LeaderboardResponse } from '@/types';

export default function LeaderboardPage() {
  const [userId, setUserId] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'global' | 'country'>('global');

  useEffect(() => {
    const storedUserId = localStorage.getItem('speedleague_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    fetchLeaderboard(storedUserId || '', 'today');
  }, []);

  const fetchLeaderboard = async (uid: string, period: string) => {
    try {
      setLoading(true);
      const url = `/api/leaderboard?period=${period}&limit=100${uid ? `&userId=${uid}` : ''}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="mx-auto max-w-[420px] px-4 pt-6 pb-24">
        
        {/* TopBar */}
        <TopBar title="Leaderboard" showMenu={false} />

        {/* Tabs */}
        <div className="mt-6">
          <LeaderboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Leaderboard List */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-[var(--muted)]">Loading leaderboard...</p>
            </div>
          ) : leaderboard ? (
            <LeaderboardList entries={leaderboard.entries} currentUserId={userId} />
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--muted)]">Failed to load leaderboard</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
