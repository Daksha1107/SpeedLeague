// User types
export interface IUser {
  _id: string;
  username?: string;
  worldId?: string;
  isVerified: boolean;
  country?: string;
  createdAt: Date;
  lastActive: Date;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate?: string;
  totalAttempts: number;
  allTimeBest?: number;
}

// Attempt types
export interface IAttempt {
  _id: string;
  userId: string;
  date: string;
  attemptNumber: number;
  reactionMs: number;
  isFalseStart: boolean;
  deviceInfo: {
    userAgent: string;
    timestamp: Date;
  };
  createdAt: Date;
}

// DailyBest types
export interface IDailyBest {
  _id: string;
  userId: string;
  date: string;
  bestMs: number;
  attemptsUsed: number;
  globalRank?: number;
  globalPercentile?: number;
  countryRank?: number;
  countryPercentile?: number;
  updatedAt: Date;
}

// League types
export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Apex';

export interface ILeague {
  _id: string;
  userId: string;
  weekStart: string;
  tier: LeagueTier;
  weeklyBestMs?: number;
  weeklyAvgMs?: number;
  promoted: boolean;
  demoted: boolean;
  gamesPlayed: number;
  updatedAt: Date;
}

// API types
export interface AttemptSubmission {
  userId: string;
  reactionMs: number;
  isFalseStart: boolean;
  timestamp: string;
  deviceInfo: {
    userAgent: string;
  };
}

export interface AttemptResponse {
  success: boolean;
  attemptSaved: boolean;
  isDailyBest: boolean;
  currentPercentile: number;
  rank: number;
  attemptsRemaining: number;
  nextMilestone?: {
    percentile: number;
    msNeeded: number;
  };
}

export interface UserStats {
  dailyBest?: number;
  currentLeague?: LeagueTier;
  currentStreak: number;
  longestStreak: number;
  attemptsRemaining: number;
  allTimeBest?: number;
  weeklyBest?: number;
  percentileMovement?: number;
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  reactionMs: number;
  country?: string;
  isVerified: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalPlayers: number;
  userRank?: number;
  userPercentile?: number;
}

// World ID types
export interface WorldIDVerification {
  proof: string;
  merkle_root: string;
  nullifier_hash: string;
  userId: string;
}

// Anti-cheat types
export interface ValidationResult {
  isValid: boolean;
  flags: string[];
  shouldSave: boolean;
}

// Speed tier types
export type SpeedTier = 'Lightning' | 'Blur' | 'Steady' | 'Slow';

export interface SpeedTierConfig {
  name: SpeedTier;
  maxMs: number;
  color: string;
  icon: string;
}
