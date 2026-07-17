import mongoose from 'mongoose';

const emailCampaignSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  message: { type: String, required: true },
  senderEmail: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientCount: { type: Number, required: true },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  status: { type: String, enum: ['sending', 'completed', 'partial', 'failed'], default: 'sending' },
  failures: [{ email: String, error: String }],
}, { timestamps: true });

export const EmailCampaign = mongoose.model('EmailCampaign', emailCampaignSchema);
