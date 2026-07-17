import mongoose from 'mongoose';

const emailDeliverySchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailCampaign', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  status: { type: String, enum: ['sending', 'sent', 'failed'], default: 'sending' },
  error: { type: String, default: '' },
  sentAt: { type: Date, default: null },
}, { timestamps: true });

emailDeliverySchema.index({ campaign: 1, user: 1 }, { unique: true });

export const EmailDelivery = mongoose.model('EmailDelivery', emailDeliverySchema);
