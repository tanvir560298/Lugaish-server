import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    language: { type: String, enum: ['english', 'arabic'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    duration: { type: Number }, // in minutes
    vocabulary: [
      {
        word: String,
        translation: String,
        pronunciation: String,
        example: String,
      },
    ],
    grammar: {
      concept: String,
      explanation: String,
      examples: [String],
    },
    speakingTasks: [
      {
        prompt: String,
        hint: String,
      },
    ],
    quiz: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
      },
    ],
  },
  { timestamps: true }
);

export const Lesson = mongoose.model('Lesson', lessonSchema);
