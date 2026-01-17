import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Attempt from '@/models/Attempt';
import DailyBest from '@/models/DailyBest';
import {
  updateLeaderboard,
  getUserRank,
  incrementAttemptCount,
  getAttemptsRemaining,
} from '@/lib/redis';
import { validateAttempt } from '@/lib/antiCheat';
import { getCurrentDate, updateStreak } from '@/lib/utils';
import { AttemptSubmission, AttemptResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: AttemptSubmission = await request.json();
    const { userId, reactionMs, isFalseStart, timestamp, deviceInfo } = body;

    // Validate required fields
    if (!userId || reactionMs === undefined || timestamp === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get or create user - Fix: Use findOne instead of findById
    let user = await User.findOne({ _id: userId });
    if (!user) {
      user = await User.create({
        _id: userId,
        isVerified: false,
        username: `Player${Math.floor(Math.random() * 10000)}`,
        currentStreak: 0,
        longestStreak: 0,
        totalAttempts: 0,
      });
    }

    const today = getCurrentDate();

    // Check attempt limit
    const attemptsRemaining = await getAttemptsRemaining(
      userId,
      today,
      user.currentStreak
    );

    if (attemptsRemaining <= 0) {
      return NextResponse.json(
        { error: 'Daily attempt limit reached' },
        { status: 429 }
      );
    }

    // Validate attempt
    const validation = validateAttempt(reactionMs, timestamp, isFalseStart);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid attempt',
          flags: validation.flags,
        },
        { status: 400 }
      );
    }

    // Increment attempt count
    const attemptNumber = await incrementAttemptCount(userId, today);

    // Save attempt to database
    const attempt = await Attempt.create({
      userId,
      date: today,
      attemptNumber,
      reactionMs: isFalseStart ? 0 : reactionMs,
      isFalseStart,
      deviceInfo: {
        userAgent: deviceInfo.userAgent,
        timestamp: new Date(timestamp),
      },
    });

    // Update user stats
    user.totalAttempts += 1;
    user.lastActive = new Date();

    // Update streak
    const streakUpdate = updateStreak(user.lastPlayedDate, user.currentStreak);
    user.currentStreak = streakUpdate.newStreak;
    user.longestStreak = Math.max(user.longestStreak, user.currentStreak);
    user.lastPlayedDate = today;

    // Update all-time best
    if (!isFalseStart) {
      if (!user.allTimeBest || reactionMs < user.allTimeBest) {
        user.allTimeBest = reactionMs;
      }
    }

    await user.save();

    let isDailyBest = false;
    let currentPercentile = 0;
    let rank = 0;

    // Only process valid, non-false-start attempts
    if (validation.shouldSave && !isFalseStart) {
      // Check if this is a daily best
      let dailyBest = await DailyBest.findOne({ userId, date: today });

      if (!dailyBest) {
        // First attempt of the day
        dailyBest = await DailyBest.create({
          userId,
          date: today,
          bestMs: reactionMs,
          attemptsUsed: attemptNumber,
        });
        isDailyBest = true;
      } else if (reactionMs < dailyBest.bestMs) {
        // New daily best
        dailyBest.bestMs = reactionMs;
        dailyBest.attemptsUsed = attemptNumber;
        await dailyBest.save();
        isDailyBest = true;
      }

      // Update leaderboard (only for daily bests)
      if (isDailyBest) {
        await updateLeaderboard(userId, reactionMs, today);
      }

      // Get rank and percentile
      const rankInfo = await getUserRank(userId, today);
      if (rankInfo && rankInfo.rank !== null) {
        rank = rankInfo.rank;
        currentPercentile = rankInfo.percentile;

        // Update daily best with rank info
        dailyBest.globalRank = rank;
        dailyBest.globalPercentile = currentPercentile;
        await dailyBest.save();
      }
    }

    // Calculate attempts remaining after this attempt
    const newAttemptsRemaining = await getAttemptsRemaining(
      userId,
      today,
      user.currentStreak
    );

    const response: AttemptResponse = {
      success: true,
      attemptSaved: validation.shouldSave,
      isDailyBest,
      currentPercentile,
      rank,
      attemptsRemaining: newAttemptsRemaining,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
