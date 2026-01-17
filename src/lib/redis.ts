import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || '';

if (!REDIS_URL) {
  console.warn('Warning: REDIS_URL not defined. Redis features will be disabled.');
}

let redis: Redis | null = null;
let redisAvailable = false;

function getRedisClient(): Redis | null {
  if (!REDIS_URL) {
    return null;
  }

  if (redis) {
    return redis;
  }

  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          return null;
        }
        return Math.min(times * 50, 2000);
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    redis.on('connect', () => {
      console.log('Redis connected');
      redisAvailable = true;
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err.message);
      redisAvailable = false;
    });

    return redis;
  } catch (error) {
    console.error('Failed to create Redis client:', error);
    return null;
  }
}

export function isRedisAvailable(): boolean {
  return redisAvailable && redis !== null;
}

// Safe wrapper for Redis operations
async function safeRedisOperation<T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  if (!isRedisAvailable()) {
    return fallback;
  }

  try {
    return await operation();
  } catch (error) {
    console.error('Redis operation failed:', error);
    return fallback;
  }
}

// Helper functions for leaderboard operations
export async function updateLeaderboard(
  userId: string,
  reactionMs: number,
  date: string
): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  await safeRedisOperation(async () => {
    const key = `leaderboard:global:${date}`;
    
    // Lower score is better, so we use the reaction time directly
    await client.zadd(key, reactionMs, userId);
    
    // Set TTL to 48 hours
    await client.expire(key, 48 * 60 * 60);
  }, undefined);
}

export async function getUserRank(
  userId: string,
  date: string
): Promise<{ rank: number | null; percentile: number; total: number }> {
  const client = getRedisClient();
  
  if (!client || !isRedisAvailable()) {
    // Fallback to MongoDB query
    return await getUserRankFromMongoDB(userId, date);
  }

  return await safeRedisOperation(async () => {
    const key = `leaderboard:global:${date}`;
    
    // Get rank (0-indexed, lower is better)
    const rank = await client.zrank(key, userId);
    
    if (rank === null) {
      return { rank: null, percentile: 0, total: 0 };
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
  }, { rank: null, percentile: 0, total: 0 });
}

export async function getTopPlayers(
  date: string,
  limit: number = 100
): Promise<Array<{ userId: string; reactionMs: number; rank: number }>> {
  const client = getRedisClient();

  if (!client || !isRedisAvailable()) {
    // Fallback to MongoDB
    return await getTopPlayersFromMongoDB(date, limit);
  }

  return await safeRedisOperation(async () => {
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
  }, []);
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

// MongoDB fallback functions
async function getUserRankFromMongoDB(userId: string, date: string) {
  const DailyBest = (await import('@/models/DailyBest')).default;
  
  const userBest = await DailyBest.findOne({ userId, date });
  if (!userBest) {
    return { rank: null, total: 0, percentile: 0 };
  }

  const betterCount = await DailyBest.countDocuments({
    date,
    bestMs: { $lt: userBest.bestMs }
  });
  
  const total = await DailyBest.countDocuments({ date });
  
  return {
    rank: betterCount + 1,
    total,
    percentile: total > 0 ? Math.round(((total - betterCount) / total) * 100 * 10) / 10 : 0
  };
}

async function getTopPlayersFromMongoDB(date: string, limit: number) {
  const DailyBest = (await import('@/models/DailyBest')).default;
  
  const results = await DailyBest.find({ date })
    .sort({ bestMs: 1 })
    .limit(limit)
    .select('userId bestMs');

  return results.map((r, i) => ({
    userId: r.userId,
    reactionMs: r.bestMs,
    rank: i + 1
  }));
}

export default getRedisClient;
