'use client';

import { Card, CardBody, Button, Progress } from '@nextui-org/react';
import { getSpeedTier } from '@/lib/utils';

interface ResultScreenProps {
  reactionMs: number;
  percentile: number;
  rank: number;
  isDailyBest: boolean;
  attemptsRemaining: number;
  onTryAgain: () => void;
  onViewLeaderboard: () => void;
}

export default function ResultScreen({
  reactionMs,
  percentile,
  rank,
  isDailyBest,
  attemptsRemaining,
  onTryAgain,
  onViewLeaderboard,
}: ResultScreenProps) {
  const speedTier = getSpeedTier(reactionMs);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardBody className="text-center py-12 space-y-6">
        {/* Reaction Time */}
        <div>
          <div className="text-6xl mb-2">{speedTier.icon}</div>
          <h1 className={`text-6xl font-bold ${speedTier.color}`}>
            {reactionMs}ms
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            {speedTier.name}
          </p>
        </div>

        {/* Daily Best Badge */}
        {isDailyBest && (
          <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 font-bold">
              🎉 New Daily Best!
            </p>
          </div>
        )}

        {/* Percentile */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-primary">
              {percentile.toFixed(1)}%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Faster than {percentile.toFixed(0)}% of players today
          </p>
          <Progress
            value={percentile}
            maxValue={100}
            color="primary"
            className="max-w-md mx-auto"
          />
        </div>

        {/* Rank */}
        {rank > 0 && (
          <div className="text-gray-600 dark:text-gray-400">
            Global Rank: <span className="font-bold">#{rank}</span>
          </div>
        )}

        {/* Attempts Remaining */}
        <div className="text-sm text-gray-500">
          {attemptsRemaining > 0 ? (
            <span>{attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining today</span>
          ) : (
            <span>No attempts remaining today</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {attemptsRemaining > 0 && (
            <Button
              size="lg"
              color="primary"
              onPress={onTryAgain}
              className="min-w-[200px]"
            >
              Try Again
            </Button>
          )}
          <Button
            size="lg"
            variant="bordered"
            onPress={onViewLeaderboard}
            className="min-w-[200px]"
          >
            View Leaderboard
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
