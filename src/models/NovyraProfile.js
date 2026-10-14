import mongoose from "mongoose";

export const NOVYRA_SUBJECTS = [
  "english",
  "arabic",
  "c",
  "java",
  "python",
  "javascript",
  "web_dev",
  "computer_science",
];

export const NOVYRA_LEVELS = ["beginner", "intermediate", "advanced"];
export const NOVYRA_GOALS = ["exam", "job_prep", "project", "general_mastery"];
export const NOVYRA_LANGUAGES = ["english", "bengali", "arabic"];

const novyraProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    targetSubject: {
      type: String,
      enum: NOVYRA_SUBJECTS,
      default: "english",
    },
    experienceLevel: {
      type: String,
      enum: NOVYRA_LEVELS,
      default: "beginner",
    },
    primaryGoal: {
      type: String,
      enum: NOVYRA_GOALS,
      default: "general_mastery",
    },
    dailyTimeMinutes: {
      type: Number,
      default: 60,
      min: 15,
      max: 360,
    },
    explanationLanguage: {
      type: String,
      enum: NOVYRA_LANGUAGES,
      default: "english",
    },
    learningPreferences: {
      depth: {
        type: String,
        enum: ["concise", "balanced", "in_depth"],
        default: "balanced",
      },
      codeExplanations: { type: Boolean, default: true },
      giveHintsFirst: { type: Boolean, default: true },
      preferredStudyTimes: {
        type: [String],
        default: ["morning", "evening"],
      },
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    weakAreas: {
      type: [String],
      default: [],
    },
    masteredTopics: {
      type: [String],
      default: [],
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    totalStudyMinutes: {
      type: Number,
      default: 0,
    },
    completedSessionsCount: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

novyraProfileSchema.index({ userId: 1, targetSubject: 1 });

export const NovyraProfile = mongoose.model("NovyraProfile", novyraProfileSchema);
