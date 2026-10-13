import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    courseGeneration: { type: String },
    contentKey: { type: String },
    requestId: { type: String, maxlength: 80 },
    completionEligible: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    day: { type: Number, required: true },
    language: { type: String, enum: ["english", "arabic"], required: true },
    responses: [
      {
        questionIndex: Number,
        selectedAnswer: Number,
        isCorrect: Boolean,
      },
    ],
    score: { type: Number },
    totalQuestions: { type: Number },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

quizSchema.index({ userId: 1, language: 1, day: 1, createdAt: -1 });

quizSchema.index({
  userId: 1,
  language: 1,
  courseGeneration: 1,
  completedAt: -1,
  _id: -1,
});
// Old attempts have no requestId; keep all historical rows unchanged.
quizSchema.index(
  { userId: 1, requestId: 1 },
  { unique: true, partialFilterExpression: { requestId: { $type: "string" } } },
);

export const Quiz = mongoose.model("Quiz", quizSchema);
