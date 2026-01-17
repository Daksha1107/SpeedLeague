import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import DailyBest from '@/models/DailyBest';
import League from '@/models/League';
import { getAttemptsRemaining } from '@/lib/redis';
import { getCurrentDate, getWeekStart } from '@/lib/utils';
import { UserStats } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user - Fix: Use findOne instead of findById
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const today = getCurrentDate();
    const weekStart = getWeekStart();

    // Get daily best for today
    const dailyBest = await DailyBest.findOne({ userId, date: today });

    // Get weekly best (best from current week)
    const weeklyBests = await DailyBest.find({
      userId,
      date: { $gte: weekStart },
    }).sort({ bestMs: 1 }).limit(1);

    const weeklyBest = weeklyBests.length > 0 ? weeklyBests[0].bestMs : undefined;

    // Get current league
    const currentLeague = await League.findOne({
      userId,
      weekStart,
    });

    // Calculate attempts remaining
    const attemptsRemaining = await getAttemptsRemaining(
      userId,
      today,
      user.currentStreak
    );

    const stats: UserStats = {
      dailyBest: dailyBest?.bestMs,
      currentLeague: currentLeague?.tier,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      attemptsRemaining,
      allTimeBest: user.allTimeBest,
      weeklyBest,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
