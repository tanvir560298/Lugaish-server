import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    sender: {
      type: String,
      enum: ["student", "novyra", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 12000,
    },
    toolCalls: [
      {
        name: { type: String, required: true },
        args: { type: mongoose.Schema.Types.Mixed },
        result: { type: mongoose.Schema.Types.Mixed },
      },
    ],
    avatarState: {
      type: String,
      enum: ["idle", "listening", "thinking", "responding", "encouraging"],
      default: "responding",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    tokenCount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const novyraConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    contextType: {
      type: String,
      enum: [
        "general",
        "daily_planner",
        "classroom",
        "study_room",
        "speaking",
        "programming",
      ],
      default: "general",
    },
    subject: {
      type: String,
      default: "general",
    },
    title: {
      type: String,
      default: "New Learning Session",
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

novyraConversationSchema.index({ userId: 1, lastActivity: -1 });
novyraConversationSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

export const NovyraConversation = mongoose.model(
  "NovyraConversation",
  novyraConversationSchema
);
