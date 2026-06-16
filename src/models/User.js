import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    languageSelected: { type: String, enum: ['english', 'arabic'], default: 'english' },
    currentDay: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    completedLessons: [{ type: Number }],
    badges: [{ type: String }],
    lastActiveDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
