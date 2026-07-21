import mongoose from 'mongoose';

const speakingQuestionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      match: /^[A-Za-z0-9_-]+$/,
    },
    question: { type: String, required: true, trim: true, maxlength: 500 },
    language: { type: String, enum: ['english', 'arabic'], required: true },
    expectedKeywords: {
      type: [String],
      required: true,
      validate: {
        validator: keywords => Array.isArray(keywords) && keywords.length > 0 && keywords.length <= 30,
        message: 'A speaking question must have between 1 and 30 expected keywords',
      },
    },
    sampleAnswer: { type: String, required: true, trim: true, maxlength: 2000 },
    maxMarks: { type: Number, required: true, min: 0.01, max: 100 },
    audioUrl: { type: String, trim: true, maxlength: 2048 },
  },
  { _id: false }
);

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
    speakingQuestions: {
      type: [speakingQuestionSchema],
      default: [],
      validate: {
        validator: questions => questions.length <= 30,
        message: 'A lesson can have at most 30 speaking questions',
      },
    },
    speakingPracticeEnabled: {
      type: Boolean,
      default: false,
    },
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
