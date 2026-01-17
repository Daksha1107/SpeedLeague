'use client';

import { LeaderboardEntry } from '@/types';
import LeaderboardRow from './LeaderboardRow';
import { measurements } from '@/styles/theme';

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

// Generate demo names for display
const generateName = (userId: string, index: number): string => {
  const names = ['Alex R.', 'Ben T.', 'Airy R.', 'Iwona R.', 'Cyort T.', 'Hoex R.', 'Sarah M.', 'Mike K.', 'Julia P.', 'David L.'];
  return names[index % names.length] || `Player ${index + 1}`;
};

export default function LeaderboardList({ entries, currentUserId }: LeaderboardListProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <LeaderboardRow
          key={entry.userId}
          rank={entry.rank}
          name={generateName(entry.userId, index)}
          reactionTime={entry.reactionMs}
          isCurrentUser={entry.userId === currentUserId}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
