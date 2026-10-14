import mongoose from "mongoose";

const novyraUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    promptTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
      min: 0,
    },
    requestCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    costEstimatedCents: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

novyraUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export const NovyraUsage = mongoose.model("NovyraUsage", novyraUsageSchema);
