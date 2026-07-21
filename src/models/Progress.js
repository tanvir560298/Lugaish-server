import mongoose from 'mongoose';

const videoCompletionSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    // Store IDs as strings so this remains compatible with existing lessons
    // and does not depend on a particular MongoDB ObjectId representation.
    completedVideoIds: { type: [String], default: [] },
    // Missing or too-early timestamps are treated as legacy/pre-release
    // progress and never unlock a video in the August 2026 course schedule.
    completedAt: { type: Date, default: null },
  },
  { _id: false }
);

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
    // Completion is intentionally separate from completedDays: a learner must
    // finish every video in the ordered playlist before a video day can be
    // marked as complete and unlock the next course day.
    videoCompletions: {
      type: [videoCompletionSchema],
      default: [],
    },
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
