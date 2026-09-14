import mongoose from 'mongoose';

const inPersonApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    whatsapp: { type: String, default: '', trim: true },
    city: { type: String, required: true, default: 'Madinah', trim: true },
    area: { type: String, default: '', trim: true },
    preferredTrack: {
      type: String,
      enum: ['english', 'arabic', 'both'],
      default: 'english',
    },
    preferredSchedule: {
      type: String,
      enum: ['weekend_morning', 'weekend_evening', 'weekday_evening'],
      default: 'weekend_morning',
    },
    occupation: { type: String, default: '', trim: true },
    learningGoal: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'approved', 'enrolled', 'declined'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    fee: { type: Number, default: 4500 },
    paidAmount: { type: Number, default: 0 },
    adminNotes: { type: String, default: '', trim: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const InPersonApplication = mongoose.model('InPersonApplication', inPersonApplicationSchema);
