import mongoose from 'mongoose';

const testerLessonSchema = new mongoose.Schema({
  testerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, enum: ['english', 'arabic'], required: true },
  day: { type: Number, required: true, min: 1, max: 365 },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

testerLessonSchema.index({ testerId: 1, language: 1, day: 1 }, { unique: true });

export const TesterLesson = mongoose.model('TesterLesson', testerLessonSchema);
