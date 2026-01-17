'use client';

import { useState, useEffect } from 'react';
import ScreenContainer from '@/components/layout/ScreenContainer';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import LeaderboardTabs from '@/components/leaderboard/LeaderboardTabs';
import LeaderboardList from '@/components/leaderboard/LeaderboardList';
import { LeaderboardResponse } from '@/types';
import { colors } from '@/styles/theme';

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
    <ScreenContainer>
      <TopBar title="Leaderboard" />

      <div className="py-6 space-y-6">
        {/* Tabs */}
        <LeaderboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Leaderboard List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p style={{ color: colors.text.secondary }}>Loading leaderboard...</p>
          </div>
        ) : leaderboard ? (
          <LeaderboardList entries={leaderboard.entries} currentUserId={userId} />
        ) : (
          <div className="text-center py-12">
            <p style={{ color: colors.text.secondary }}>Failed to load leaderboard</p>
          </div>
        )}
      </div>

      <BottomNav />
    </ScreenContainer>
  );
}
