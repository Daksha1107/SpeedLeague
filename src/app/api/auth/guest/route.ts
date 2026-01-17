import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST() {
  try {
    await connectDB();

    const userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const user = await User.create({
      _id: userId,
      isVerified: false,
      username: `Guest${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date(),
      lastActive: new Date(),
      currentStreak: 0,
      longestStreak: 0,
      totalAttempts: 0,
    });

    return NextResponse.json({
      success: true,
      userId: user._id,
      username: user.username,
      isVerified: false,
    });

  } catch (error) {
    console.error('Guest user creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create guest user' },
      { status: 500 }
    );
  }
}
