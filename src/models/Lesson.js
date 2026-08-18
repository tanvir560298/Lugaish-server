import mongoose from 'mongoose';

const lessonVideoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    youtubeId: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1, max: 600 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const lessonSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    language: { type: String, enum: ['english', 'arabic'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String },
    duration: { type: Number }, // in minutes
    videos: { type: [lessonVideoSchema], default: [] },
    moduleType: { type: String, enum: ['video', 'ai_practice', 'interview'], default: 'video' },
    modulePublished: { type: Boolean, default: false },
    moduleIntroTitle: { type: String, default: '', maxlength: 160 },
    moduleIntroText: { type: String, default: '', maxlength: 2000 },
    speakingQuestions: [{
      id: { type: String, required: true, maxlength: 80 },
      question: { type: String, required: true, maxlength: 500 },
      language: { type: String, enum: ['english', 'arabic'], required: true },
      expectedKeywords: [{ type: String, maxlength: 100 }],
      sampleAnswer: { type: String, required: true, maxlength: 2000 },
      maxMarks: { type: Number, required: true, min: 1, max: 100 },
      audioUrl: { type: String, maxlength: 2048 },
    }],
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

lessonSchema.index({ language: 1, day: 1 }, { unique: true });

export const Lesson = mongoose.model('Lesson', lessonSchema);
