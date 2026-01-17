import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { proof, nullifier_hash, verification_level } = await req.json();

    // For now, we'll accept the proof from MiniKit
    // In production, you should verify with verifyCloudProof
    if (!nullifier_hash) {
      return NextResponse.json(
        { error: 'Missing nullifier_hash' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists with this World ID
    let user = await User.findOne({ worldId: nullifier_hash });

    if (!user) {
      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      user = await User.create({
        _id: userId,
        worldId: nullifier_hash,
        isVerified: true,
        username: `Player${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date(),
        lastActive: new Date(),
        currentStreak: 0,
        longestStreak: 0,
        totalAttempts: 0,
      });
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      userId: user._id,
      username: user.username,
      isVerified: user.isVerified,
    });

  } catch (error) {
    console.error('World ID verification error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
