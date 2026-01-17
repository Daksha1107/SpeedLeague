import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || '';

if (!REDIS_URL) {
  console.warn('Warning: REDIS_URL not defined. Redis features will be disabled.');
}

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!REDIS_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 50, 2000);
      },
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  return redis;
}

// Helper functions for leaderboard operations
export async function updateLeaderboard(
  userId: string,
  reactionMs: number,
  date: string
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  const key = `leaderboard:global:${date}`;
  
  // Lower score is better, so we use the reaction time directly
  await client.zadd(key, reactionMs, userId);
  
  // Set TTL to 48 hours
  await client.expire(key, 48 * 60 * 60);
}

export async function getUserRank(
  userId: string,
  date: string
): Promise<{ rank: number; percentile: number; total: number } | null> {
  const client = getRedisClient();
  if (!client) return null;

  const key = `leaderboard:global:${date}`;
  
  // Get rank (0-indexed, lower is better)
  const rank = await client.zrank(key, userId);
  
  if (rank === null) {
    return null;
  }

  // Get total number of players
  const total = await client.zcard(key);
  
  // Calculate percentile (higher is better)
  const percentile = total > 0 ? ((total - rank - 1) / total) * 100 : 0;

  return {
    rank: rank + 1, // Convert to 1-indexed
    percentile: Math.round(percentile * 10) / 10,
    total,
  };
}

export async function getTopPlayers(
  date: string,
  limit: number = 100
): Promise<Array<{ userId: string; reactionMs: number; rank: number }>> {
  const client = getRedisClient();
  if (!client) return [];

  const key = `leaderboard:global:${date}`;
  
  // Get top players with scores (ZRANGE with WITHSCORES)
  const results = await client.zrange(key, 0, limit - 1, 'WITHSCORES');
  
  const players: Array<{ userId: string; reactionMs: number; rank: number }> = [];
  
  for (let i = 0; i < results.length; i += 2) {
    players.push({
      userId: results[i],
      reactionMs: parseFloat(results[i + 1]),
      rank: i / 2 + 1,
    });
  }

  return players;
}

export async function getUserDailyBest(
  userId: string,
  date: string
): Promise<{ bestMs: number; attemptsUsed: number; percentile: number } | null> {
  const client = getRedisClient();
  if (!client) return null;

  const key = `user:${userId}:best:${date}`;
  const data = await client.get(key);
  
  if (!data) {
    return null;
  }

  return JSON.parse(data);
}

export async function setUserDailyBest(
  userId: string,
  date: string,
  data: { bestMs: number; attemptsUsed: number; percentile: number }
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  const key = `user:${userId}:best:${date}`;
  await client.setex(key, 24 * 60 * 60, JSON.stringify(data));
}

export async function incrementAttemptCount(
  userId: string,
  date: string
): Promise<number> {
  const client = getRedisClient();
  if (!client) {
    // Fallback: return 1 if Redis is not available
    return 1;
  }

  const key = `ratelimit:${userId}:${date}`;
  const count = await client.incr(key);
  
  // Set TTL on first increment
  if (count === 1) {
    await client.expire(key, 24 * 60 * 60);
  }

  return count;
}

export async function getAttemptCount(
  userId: string,
  date: string
): Promise<number> {
  const client = getRedisClient();
  if (!client) return 0;

  const key = `ratelimit:${userId}:${date}`;
  const count = await client.get(key);
  
  return count ? parseInt(count, 10) : 0;
}

export async function getAttemptsRemaining(
  userId: string,
  date: string,
  currentStreak: number
): Promise<number> {
  const used = await getAttemptCount(userId, date);
  
  // Base 3 attempts + streak bonuses
  let maxAttempts = 3;
  if (currentStreak >= 7) {
    maxAttempts += 2; // +2 at day 7
  } else if (currentStreak >= 3) {
    maxAttempts += 1; // +1 at day 3
  }

  return Math.max(0, maxAttempts - used);
}

export default getRedisClient;
