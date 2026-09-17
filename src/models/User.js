import mongoose from 'mongoose';
import { ROLE_VALUES, ROLES, normalizeRole } from '../utils/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    authProvider: { type: String, enum: ['firebase', 'google', 'local'], default: 'firebase' },
    googleSub: { type: String, unique: true, sparse: true },
    firebaseUid: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.learner,
      set: normalizeRole,
    },
    learnerProfile: {
      profession: { type: String, default: '' },
      expectation: { type: String, default: '' },
      courseDuration: { type: String, default: '' },
      referralSource: { type: String, default: '' },
    },
    languageSelected: { type: String, enum: ['english', 'arabic'], default: 'english' },
    enrolledPathways: {
      type: [String],
      enum: ['english', 'arabic', 'paid_batch'],
      default: ['english'],
    },
    privateBatchAccess: { type: Boolean, default: false },
    privateBatchExplicitlyRevoked: { type: Boolean, default: false },
    seatApplications: [
      {
        language: { type: String, enum: ['english', 'arabic'], required: true },
        goal: { type: String, default: '' },
        availability: { type: String, default: '' },
        contactPreference: { type: String, default: '' },
        status: {
          type: String,
          enum: ['pending', 'approved', 'declined'],
          default: 'pending',
        },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    inPersonBatch: {
      hasApplied: { type: Boolean, default: false },
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      city: { type: String, default: '' },
      area: { type: String, default: '' },
      preferredTrack: { type: String, enum: ['english', 'arabic', 'both'], default: 'english' },
      preferredSchedule: { type: String, default: 'weekend_morning' },
      occupation: { type: String, default: '' },
      learningGoal: { type: String, default: '' },
      status: {
        type: String,
        enum: ['unapplied', 'pending', 'contacted', 'approved', 'enrolled', 'declined'],
        default: 'unapplied',
      },
      paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid'],
        default: 'unpaid',
      },
      paidAmount: { type: Number, default: 0 },
      submittedAt: { type: Date },
      adminNotes: { type: String, default: '' },
    },
    currentDay: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    totalXP: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    referralCode: { type: String, unique: true, sparse: true, uppercase: true, trim: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    completedLessons: [{ type: Number }],
    completionRewards: [{ type: String }],
    badges: [{ type: String }],
    lastActiveDate: { type: Date, default: Date.now },
    arabicStartDate: { type: Date },
    englishStartDate: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('validate', function normalizeLegacyRole(next) {
  this.role = normalizeRole(this.role);
  next();
});

export const User = mongoose.model('User', userSchema);
