'use client';

import { Card, CardBody, CardHeader, Chip, Divider } from '@nextui-org/react';
import { LeaderboardEntry } from '@/types';

interface GlobalLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function GlobalLeaderboard({ entries, currentUserId }: GlobalLeaderboardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No leaderboard data available yet.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">🏆 Global Leaderboard</h2>
      </CardHeader>
      <Divider />
      <CardBody className="p-0">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUserId;
          
          return (
            <div
              key={entry.userId}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                isCurrentUser ? 'bg-blue-50 dark:bg-blue-950' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Rank */}
                <div className={`text-2xl font-bold min-w-[60px] ${getRankColor(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {isCurrentUser ? 'You' : `Player ${entry.userId.slice(0, 8)}`}
                    </span>
                    {entry.isVerified && (
                      <Chip size="sm" color="primary" variant="flat">
                        ✓ Verified
                      </Chip>
                    )}
                    {entry.country && (
                      <span className="text-sm text-gray-500">
                        {entry.country}
                      </span>
                    )}
                  </div>
                </div>

                {/* Reaction Time */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {entry.reactionMs}ms
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
