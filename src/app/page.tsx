'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Progress, Tabs, Tab } from '@nextui-org/react';
import StreakBadge from '@/components/game/StreakBadge';
import AttemptCounter from '@/components/game/AttemptCounter';
import LeagueBadge from '@/components/leaderboard/LeagueBadge';
import { UserStats } from '@/types';
import { getTimeUntilReset, generateUserId } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState('');

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

    // Update countdown timer
    const interval = setInterval(() => {
      setTimeUntilReset(getTimeUntilReset());
    }, 60000); // Update every minute

    setTimeUntilReset(getTimeUntilReset());

    return () => clearInterval(interval);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  const attemptsUsed = stats ? (stats.attemptsRemaining >= 3 ? 0 : 3 - stats.attemptsRemaining) : 0;
  const totalAttempts = 3 + (stats && stats.currentStreak >= 7 ? 2 : stats && stats.currentStreak >= 3 ? 1 : 0);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            ⚡ SpeedLeague
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your reaction speed and compete globally
          </p>
        </div>

        {/* Today's Best */}
        {stats?.dailyBest && (
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <CardBody className="text-center py-8">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                YOUR BEST TODAY
              </p>
              <h2 className="text-5xl font-bold text-primary mb-2">
                ⚡ {stats.dailyBest}ms
              </h2>
              {stats.currentLeague && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <LeagueBadge tier={stats.currentLeague} size="lg" />
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Streak */}
        {stats && (
          <StreakBadge
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
          />
        )}

        {/* Attempt Counter */}
        <AttemptCounter used={attemptsUsed} total={totalAttempts} />

        {/* Reset Timer */}
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ⏱ Resets in <span className="font-bold">{timeUntilReset}</span>
            </p>
          </CardBody>
        </Card>

        {/* Play Button */}
        <Button
          size="lg"
          color="primary"
          className="w-full text-xl py-8"
          onPress={handlePlayDuel}
          isDisabled={stats?.attemptsRemaining === 0}
        >
          {stats?.attemptsRemaining === 0 ? 'No Attempts Remaining' : `PLAY DUEL (${stats?.attemptsRemaining || 3}/${totalAttempts})`}
        </Button>

        {/* Navigation Tabs */}
        <Card>
          <CardBody>
            <Tabs
              aria-label="Navigation"
              fullWidth
              onSelectionChange={(key) => {
                if (key === 'stats') router.push('/stats');
                if (key === 'leaderboard') router.push('/leaderboard');
              }}
            >
              <Tab key="home" title="Home" />
              <Tab key="stats" title="Stats" />
              <Tab key="leaderboard" title="Leaderboard" />
            </Tabs>
          </CardBody>
        </Card>

        {/* All-Time Best */}
        {stats?.allTimeBest && (
          <Card>
            <CardBody className="flex flex-row items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All-Time Best
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.allTimeBest}ms
                </p>
              </div>
              {stats.weeklyBest && (
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This Week
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.weeklyBest}ms
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
