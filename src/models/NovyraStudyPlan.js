import mongoose from "mongoose";

const studyBlockSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "concept",
        "practice",
        "quiz",
        "break",
        "reflection",
        "coding_exercise",
      ],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    objectives: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    materials: { type: [String], default: [] },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    studentNotes: { type: String, default: "" },
  },
  { _id: false }
);

const novyraStudyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    targetDurationMinutes: {
      type: Number,
      required: true,
      min: 15,
      max: 360,
    },
    actualDurationMinutes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "abandoned"],
      default: "active",
      index: true,
    },
    blocks: {
      type: [studyBlockSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Study plan must contain at least one study block",
      },
    },
    currentBlockIndex: {
      type: Number,
      default: 0,
      min: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    studentReflection: {
      type: String,
      default: "",
    },
    confidenceRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    recommendedNextActivity: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, optimisticConcurrency: true }
);

novyraStudyPlanSchema.index({ userId: 1, status: 1, createdAt: -1 });

export const NovyraStudyPlan = mongoose.model(
  "NovyraStudyPlan",
  novyraStudyPlanSchema
);
