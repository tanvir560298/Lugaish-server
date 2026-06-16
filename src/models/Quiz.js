import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: Number, required: true },
    language: { type: String, enum: ['english', 'arabic'], required: true },
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
  { timestamps: true }
);

export const Quiz = mongoose.model('Quiz', quizSchema);
