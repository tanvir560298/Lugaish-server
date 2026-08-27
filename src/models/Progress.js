import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    language: { type: String, enum: ['english', 'arabic'], required: true },
    completedDays: [
      {
        day: Number,
        completedAt: Date,
        score: Number,
      },
    ],
    currentDay: { type: Number, default: 1, min: 1 },
    nextUnlockAt: { type: Date, default: null },
    totalXP: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
    weakAreas: [String],
    achievements: [
      {
        name: String,
        unlockedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export const Progress = mongoose.model('Progress', progressSchema);
