import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sourceQuiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    courseGeneration: { type: String, required: true },
    language: { type: String, enum: ["english", "arabic"], required: true },
    questionIndex: { type: Number, required: true },
    requestId: { type: String, required: true, maxlength: 80 },
    selectedAnswer: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);
schema.index({ userId: 1, requestId: 1 }, { unique: true });
schema.index({ userId: 1, language: 1, courseGeneration: 1, createdAt: -1 });
schema.index({userId:1,language:1,courseGeneration:1,completedAt:-1,_id:-1});
export const ReviewAttempt = mongoose.model("ReviewAttempt", schema);
