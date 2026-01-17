'use client';

import { Card, CardBody } from '@nextui-org/react';

interface RankCardProps {
  rank: number;
  percentile: number;
  totalPlayers: number;
}

export default function RankCard({ rank, percentile, totalPlayers }: RankCardProps) {
  return (
    <Card>
      <CardBody className="text-center py-8">
        <div className="text-5xl mb-2">
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅'}
        </div>
        <h3 className="text-4xl font-bold text-primary mb-2">
          #{rank}
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Top {percentile.toFixed(1)}% globally
        </p>
        <p className="text-sm text-gray-500">
          Out of {totalPlayers.toLocaleString()} players
        </p>
      </CardBody>
    </Card>
  );
}
