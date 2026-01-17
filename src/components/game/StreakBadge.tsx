'use client';

import { Card, CardBody, Badge } from '@nextui-org/react';

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakBadge({ currentStreak, longestStreak }: StreakBadgeProps) {
  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 7) return '🔥🔥';
    if (streak >= 3) return '🔥';
    return '✨';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'danger';
    if (streak >= 3) return 'warning';
    return 'default';
  };

  const getNextBonus = (streak: number) => {
    if (streak < 3) return { days: 3 - streak, bonus: '+1 attempt' };
    if (streak < 7) return { days: 7 - streak, bonus: '+1 more attempt' };
    return null;
  };

  const nextBonus = getNextBonus(currentStreak);

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getStreakIcon(currentStreak)}</span>
              <span className="text-3xl font-bold">
                {currentStreak} day{currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          {longestStreak > currentStreak && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Best Streak</p>
              <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                {longestStreak} days
              </p>
            </div>
          )}
        </div>

        {nextBonus && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ⭐ Next bonus in {nextBonus.days} day{nextBonus.days !== 1 ? 's' : ''}: {nextBonus.bonus}
            </p>
          </div>
        )}

        {currentStreak >= 7 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-3">
            <p className="text-sm text-white font-bold text-center">
              🎉 Max Bonus Unlocked: 5 attempts per day!
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
