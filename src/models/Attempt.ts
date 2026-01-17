import mongoose, { Schema, Model } from 'mongoose';
import { IAttempt } from '@/types';

const AttemptSchema = new Schema<IAttempt>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  date: {
    type: String,
    required: true,
  },
  attemptNumber: {
    type: Number,
    required: true,
  },
  reactionMs: {
    type: Number,
    required: true,
  },
  isFalseStart: {
    type: Boolean,
    default: false,
  },
  deviceInfo: {
    userAgent: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
AttemptSchema.index({ userId: 1, date: -1 });
AttemptSchema.index({ date: 1, reactionMs: 1 });

const Attempt: Model<IAttempt> = mongoose.models.Attempt || mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
