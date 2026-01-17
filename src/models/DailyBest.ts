import mongoose, { Schema, Model } from 'mongoose';
import { IDailyBest } from '@/types';

const DailyBestSchema = new Schema<IDailyBest>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  date: {
    type: String,
    required: true,
  },
  bestMs: {
    type: Number,
    required: true,
  },
  attemptsUsed: {
    type: Number,
    required: true,
  },
  globalRank: {
    type: Number,
  },
  globalPercentile: {
    type: Number,
  },
  countryRank: {
    type: Number,
  },
  countryPercentile: {
    type: Number,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
DailyBestSchema.index({ userId: 1, date: -1 }, { unique: true });
DailyBestSchema.index({ date: 1, bestMs: 1 });

const DailyBest: Model<IDailyBest> = mongoose.models.DailyBest || mongoose.model<IDailyBest>('DailyBest', DailyBestSchema);

export default DailyBest;
