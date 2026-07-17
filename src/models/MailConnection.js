import mongoose from 'mongoose';

const mailConnectionSchema = new mongoose.Schema({
  key: { type: String, unique: true, default: 'primary' },
  senderEmail: { type: String, required: true },
  encryptedRefreshToken: { type: String, required: true },
  connectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  connectedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const MailConnection = mongoose.model('MailConnection', mailConnectionSchema);
