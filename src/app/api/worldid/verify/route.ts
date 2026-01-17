import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyWorldIDProof } from '@/lib/worldid';
import { WorldIDVerification } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: WorldIDVerification = await request.json();
    const { proof, merkle_root, nullifier_hash, userId } = body;

    // Validate required fields
    if (!proof || !merkle_root || !nullifier_hash || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the World ID proof
    const verificationResult = await verifyWorldIDProof(body);

    if (!verificationResult.success) {
      return NextResponse.json(
        { error: verificationResult.error || 'Verification failed' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if nullifier has already been used
    const existingUser = await User.findOne({ worldId: nullifier_hash });
    if (existingUser && existingUser._id !== userId) {
      return NextResponse.json(
        { error: 'This World ID has already been verified with another account' },
        { status: 400 }
      );
    }

    // Update user with verification - Fix: Use findOne instead of findById
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    user.worldId = nullifier_hash;
    user.isVerified = true;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'World ID verified successfully',
    });
  } catch (error) {
    console.error('Error verifying World ID:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
