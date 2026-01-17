'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
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

  const handleBackHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600 dark:text-gray-400">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="light" onPress={handleBackHome}>
            ← Back
          </Button>
          <h1 className="text-3xl font-bold">📊 Your Stats</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Personal Bests */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Personal Bests</h2>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">All-Time Best</span>
              <span className="text-2xl font-bold text-primary">
                {stats?.allTimeBest ? `${stats.allTimeBest}ms` : 'No data'}
              </span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">This Week</span>
              <span className="text-2xl font-bold">
                {stats?.weeklyBest ? `${stats.weeklyBest}ms` : 'No data'}
              </span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Today</span>
              <span className="text-2xl font-bold">
                {stats?.dailyBest ? `${stats.dailyBest}ms` : 'No data'}
              </span>
            </div>
          </CardBody>
        </Card>

        {/* Streaks */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Streaks</h2>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Current Streak</span>
              <span className="text-2xl font-bold text-orange-500">
                🔥 {stats?.currentStreak || 0} days
              </span>
            </div>
            <Divider />
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Longest Streak</span>
              <span className="text-2xl font-bold">
                {stats?.longestStreak || 0} days
              </span>
            </div>
          </CardBody>
        </Card>

        {/* League */}
        {stats?.currentLeague && (
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Current League</h2>
            </CardHeader>
            <Divider />
            <CardBody className="text-center py-8">
              <div className="text-5xl mb-2">
                {stats.currentLeague === 'Apex' ? '⚡' :
                 stats.currentLeague === 'Diamond' ? '💎' :
                 stats.currentLeague === 'Gold' ? '🥇' :
                 stats.currentLeague === 'Silver' ? '🥈' : '🥉'}
              </div>
              <p className="text-3xl font-bold">{stats.currentLeague}</p>
            </CardBody>
          </Card>
        )}

        {/* Attempts */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold">Today&apos;s Attempts</h2>
          </CardHeader>
          <Divider />
          <CardBody className="text-center py-8">
            <p className="text-4xl font-bold text-primary">
              {stats?.attemptsRemaining || 0}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              attempts remaining
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
