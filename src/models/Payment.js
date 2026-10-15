import mongoose from 'mongoose';

const bankSettingsSchema = new mongoose.Schema(
  {
    screenshotUrl: { type: String, default: '/bank-details-qr.png' },
    bankName: { type: String, default: 'Al Rajhi Bank' },
    accountName: { type: String, default: 'TANVIR AHMAD' },
    accountNumber: { type: String, default: '077040010006081217472' },
    iban: { type: String, default: 'SA89 8000 0859 6080 1121 7472' },
    branchName: { type: String, default: '' },
    routingNumber: { type: String, default: '' },
    mobileBanking: { type: String, default: '' },
    transferInstructions: {
      type: String,
      default: 'Please transfer the monthly fee to the bank account above or scan the QR code. You can use either the Account Number or IBAN. Enter your name or email as the transfer reference. Once transferred, click "I\'ve transferred the payment" and submit your details. Your payment will be verified within 24 hours.',
    },
    updatedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

const paymentRecordSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 5 },
    fee: { type: Number, default: 50 },
    currency: { type: String, default: 'SAR' },
    status: {
      type: String,
      enum: ['due', 'pending', 'received'],
      default: 'due',
    },
    senderName: { type: String, default: '' },
    transferDate: { type: String, default: '' },
    transactionRef: { type: String, default: '' },
    receiptUrl: { type: String, default: '' },
    submittedAt: { type: Date },
    confirmedAt: { type: Date },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

paymentRecordSchema.index({ userEmail: 1, month: 1 }, { unique: true });

const paymentNotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['confirmation', 'reminder', 'general'], default: 'confirmation' },
    month: { type: Number, default: 1 },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BankSettings = mongoose.model('BankSettings', bankSettingsSchema);
export const PaymentRecord = mongoose.model('PaymentRecord', paymentRecordSchema);
export const PaymentNotification = mongoose.model('PaymentNotification', paymentNotificationSchema);
