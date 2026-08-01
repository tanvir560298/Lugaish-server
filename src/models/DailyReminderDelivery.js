import mongoose from 'mongoose';

const dailyReminderDeliverySchema = new mongoose.Schema({
  dateKey: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  day: { type: Number, required: true, min: 1 },
  language: { type: String, enum: ['english', 'arabic'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['sending', 'sent', 'failed'], default: 'sending' },
  error: { type: String, default: '' },
  sentAt: { type: Date, default: null },
}, { timestamps: true });

dailyReminderDeliverySchema.index({ dateKey: 1, language: 1, user: 1 }, { unique: true });

export const DailyReminderDelivery = mongoose.model('DailyReminderDelivery', dailyReminderDeliverySchema);
