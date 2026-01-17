import mongoose, { Schema, Model } from 'mongoose';
import { ILeague } from '@/types';

const LeagueSchema = new Schema<ILeague>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  weekStart: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    required: true,
    enum: ['Bronze', 'Silver', 'Gold', 'Diamond', 'Apex'],
    default: 'Bronze',
  },
  weeklyBestMs: {
    type: Number,
  },
  weeklyAvgMs: {
    type: Number,
  },
  promoted: {
    type: Boolean,
    default: false,
  },
  demoted: {
    type: Boolean,
    default: false,
  },
  gamesPlayed: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
LeagueSchema.index({ userId: 1, weekStart: -1 }, { unique: true });
LeagueSchema.index({ weekStart: 1, tier: 1, weeklyBestMs: 1 });

const League: Model<ILeague> = mongoose.models.League || mongoose.model<ILeague>('League', LeagueSchema);

export default League;
