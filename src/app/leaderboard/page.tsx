'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Tabs, Tab } from '@nextui-org/react';
import GlobalLeaderboard from '@/components/leaderboard/GlobalLeaderboard';
import RankCard from '@/components/leaderboard/RankCard';
import { LeaderboardResponse } from '@/types';

export default function LeaderboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'alltime'>('today');

  useEffect(() => {
    const storedUserId = localStorage.getItem('speedleague_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    fetchLeaderboard(storedUserId || '', period);
  }, [period]);

  const fetchLeaderboard = async (uid: string, p: string) => {
    try {
      setLoading(true);
      const url = `/api/leaderboard?period=${p}&limit=100${uid ? `&userId=${uid}` : ''}`;
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

  const handleBackHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="light" onPress={handleBackHome}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Period Tabs */}
        <Tabs
          selectedKey={period}
          onSelectionChange={(key) => setPeriod(key as 'today' | 'week' | 'alltime')}
          fullWidth
          size="lg"
        >
          <Tab key="today" title="Today" />
          <Tab key="week" title="This Week" />
          <Tab key="alltime" title="All Time" />
        </Tabs>

        {/* User's Rank Card */}
        {leaderboard && leaderboard.userRank && leaderboard.userPercentile !== undefined && (
          <RankCard
            rank={leaderboard.userRank}
            percentile={leaderboard.userPercentile}
            totalPlayers={leaderboard.totalPlayers}
          />
        )}

        {/* Leaderboard */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
          </div>
        ) : leaderboard ? (
          <GlobalLeaderboard entries={leaderboard.entries} currentUserId={userId} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Failed to load leaderboard</p>
          </div>
        )}
      </div>
    </div>
  );
}
