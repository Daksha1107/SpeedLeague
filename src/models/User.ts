import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>({
  _id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  worldId: {
    type: String,
    unique: true,
    sparse: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  country: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastPlayedDate: {
    type: String,
  },
  totalAttempts: {
    type: Number,
    default: 0,
  },
  allTimeBest: {
    type: Number,
  },
  // User preferences and settings
  preferences: {
    soundEnabled: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
}, { _id: false });

// Index for verified users sorted by activity
UserSchema.index({ isVerified: 1, lastActive: -1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
