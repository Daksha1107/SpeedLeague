import { SpeedTier, SpeedTierConfig, LeagueTier } from '@/types';

// Get current date in YYYY-MM-DD format (UTC)
export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Get start of current week (Monday) in YYYY-MM-DD format
export function getWeekStart(date?: Date): string {
  const d = date || new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Calculate speed tier based on reaction time
export function getSpeedTier(reactionMs: number): SpeedTierConfig {
  if (reactionMs < 200) {
    return {
      name: 'Lightning',
      maxMs: 200,
      color: 'text-yellow-400',
      icon: '⚡',
    };
  } else if (reactionMs < 300) {
    return {
      name: 'Blur',
      maxMs: 300,
      color: 'text-blue-400',
      icon: '💨',
    };
  } else if (reactionMs < 400) {
    return {
      name: 'Steady',
      maxMs: 400,
      color: 'text-green-400',
      icon: '🎯',
    };
  } else {
    return {
      name: 'Slow',
      maxMs: Infinity,
      color: 'text-gray-400',
      icon: '🐌',
    };
  }
}

// Calculate league tier based on percentile
export function calculateLeagueTier(percentile: number): LeagueTier {
  if (percentile >= 99) return 'Apex';
  if (percentile >= 95) return 'Diamond';
  if (percentile >= 80) return 'Gold';
  if (percentile >= 60) return 'Silver';
  return 'Bronze';
}

// Get league tier icon
export function getLeagueTierIcon(tier: LeagueTier): string {
  const icons: Record<LeagueTier, string> = {
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
    Diamond: '💎',
    Apex: '⚡',
  };
  return icons[tier];
}

// Calculate time until midnight UTC
export function getTimeUntilReset(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

// Update user streak
export function updateStreak(
  lastPlayedDate: string | undefined,
  currentStreak: number
): { newStreak: number; isNewStreak: boolean } {
  const today = getCurrentDate();

  if (!lastPlayedDate) {
    return { newStreak: 1, isNewStreak: true };
  }

  // Parse dates
  const lastDate = new Date(lastPlayedDate);
  const todayDate = new Date(today);

  // Calculate difference in days
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day, no change
    return { newStreak: currentStreak, isNewStreak: false };
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    return { newStreak: currentStreak + 1, isNewStreak: false };
  } else {
    // Streak broken, reset to 1
    return { newStreak: 1, isNewStreak: true };
  }
}

// Format reaction time
export function formatReactionTime(ms: number): string {
  return `${ms}ms`;
}

// Calculate percentile rank
export function calculatePercentile(rank: number, total: number): number {
  if (total === 0) return 0;
  return Math.round(((total - rank + 1) / total) * 100 * 10) / 10;
}

// Generate user ID (simple implementation)
export function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
