import mongoose from 'mongoose';

const interviewQueueEntrySchema = new mongoose.Schema(
  {
    sessionKey: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    language: { type: String, enum: ['english', 'arabic'], default: 'english' },
    roomIndex: { type: Number, required: true },
    roomName: { type: String, required: true },
    meetUrl: { type: String, required: true },
    globalSerial: { type: Number, required: true },
    roomSerial: { type: Number, required: true },
    status: {
      type: String,
      enum: ['waiting', 'done', 'skipped'],
      default: 'waiting',
    },
    joinedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

interviewQueueEntrySchema.index({ sessionKey: 1, userId: 1 }, { unique: true });
interviewQueueEntrySchema.index({ sessionKey: 1, globalSerial: 1 }, { unique: true });
interviewQueueEntrySchema.index({ sessionKey: 1, roomIndex: 1, roomSerial: 1 }, { unique: true });

export const InterviewQueueEntry = mongoose.model('InterviewQueueEntry', interviewQueueEntrySchema);
