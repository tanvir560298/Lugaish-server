import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  language: { type: String, enum: ['english', 'arabic'], required: true },
  milestone: { type: Number, enum: [7, 14, 21, 30], required: true },
  recipientName: { type: String, required: true, trim: true, maxlength: 100 },
  certificateCode: { type: String, required: true, unique: true, index: true },
  issuedAt: { type: Date, default: Date.now },
}, { timestamps: true });

certificateSchema.index({ userId: 1, language: 1, milestone: 1 }, { unique: true });

export const Certificate = mongoose.model('Certificate', certificateSchema);
