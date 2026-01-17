import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import DailyBest from '@/models/DailyBest';
import { getTopPlayers, getUserRank } from '@/lib/redis';
import { getCurrentDate } from '@/lib/utils';
import { LeaderboardResponse, LeaderboardEntry } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get('scope') || 'global';
    const period = searchParams.get('period') || 'today';
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const userId = searchParams.get('userId');

    await connectDB();

    const today = getCurrentDate();
    let entries: LeaderboardEntry[] = [];
    let totalPlayers = 0;
    let userRank: number | undefined;
    let userPercentile: number | undefined;

    if (period === 'today') {
      // Use Redis for today's leaderboard
      const topPlayers = await getTopPlayers(today, limit);
      totalPlayers = topPlayers.length;

      // Get user details for each player
      const userIds = topPlayers.map(p => p.userId);
      const users = await User.find({ _id: { $in: userIds } });

      const userMap = new Map(users.map(u => [u._id.toString(), u]));

      entries = topPlayers.map(player => {
        const user = userMap.get(player.userId);
        return {
          userId: player.userId,
          rank: player.rank,
          reactionMs: player.reactionMs,
          country: user?.country,
          isVerified: user?.isVerified || false,
        };
      });

      // If userId provided, get their rank
      if (userId) {
        const rankInfo = await getUserRank(userId, today);
        if (rankInfo) {
          userRank = rankInfo.rank;
          userPercentile = rankInfo.percentile;
        }

        // If user is not in top N, include context around their position
        const userInTop = entries.some(e => e.userId === userId);
        if (!userInTop && rankInfo) {
          // Get 5 players above and below the user
          const contextPlayers = await getTopPlayers(today, 1000);
          const userIndex = contextPlayers.findIndex(p => p.userId === userId);
          
          if (userIndex !== -1) {
            const start = Math.max(0, userIndex - 5);
            const end = Math.min(contextPlayers.length, userIndex + 6);
            const contextEntries = contextPlayers.slice(start, end);

            const contextUserIds = contextEntries.map(p => p.userId);
            const contextUsers = await User.find({ _id: { $in: contextUserIds } });
            const contextUserMap = new Map(contextUsers.map(u => [u._id.toString(), u]));

            entries = contextEntries.map(player => {
              const user = contextUserMap.get(player.userId);
              return {
                userId: player.userId,
                rank: player.rank,
                reactionMs: player.reactionMs,
                country: user?.country,
                isVerified: user?.isVerified || false,
              };
            });
          }
        }
      }
    } else if (period === 'week' || period === 'alltime') {
      // Use MongoDB for historical data
      const query: any = {};
      
      if (period === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query.date = { $gte: weekAgo.toISOString().split('T')[0] };
      }

      const dailyBests = await DailyBest.find(query)
        .sort({ bestMs: 1 })
        .limit(limit);

      totalPlayers = dailyBests.length;

      const userIds = dailyBests.map(db => db.userId);
      const users = await User.find({ _id: { $in: userIds } });
      const userMap = new Map(users.map(u => [u._id.toString(), u]));

      entries = dailyBests.map((db, index) => {
        const user = userMap.get(db.userId);
        return {
          userId: db.userId,
          rank: index + 1,
          reactionMs: db.bestMs,
          country: user?.country,
          isVerified: user?.isVerified || false,
        };
      });

      // Find user's rank if provided
      if (userId) {
        const userEntry = entries.find(e => e.userId === userId);
        if (userEntry) {
          userRank = userEntry.rank;
          userPercentile = ((totalPlayers - userRank + 1) / totalPlayers) * 100;
        }
      }
    }

    const response: LeaderboardResponse = {
      entries,
      totalPlayers,
      userRank,
      userPercentile,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
