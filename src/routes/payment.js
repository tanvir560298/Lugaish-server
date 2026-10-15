import express from 'express';
import { BankSettings, PaymentRecord, PaymentNotification } from '../models/Payment.js';
import { User } from '../models/User.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';
import { ROLES, normalizeRole } from '../utils/roles.js';

const router = express.Router();
const webDeveloperEmails = new Set(['tanvir560298@gmail.com', 'lugaish2026@gmail.com', 'hmhuraira@gmail.com']);

function isStaffOrDeveloper(user) {
  if (!user) return false;
  const role = normalizeRole(user.role);
  return role === ROLES.webDeveloper || webDeveloperEmails.has(user.email?.toLowerCase());
}

// 1. Get bank details & instructions
router.get('/bank-details', async (req, res) => {
  try {
    let settings = await BankSettings.findOne().sort({ createdAt: -1 });
    if (!settings) {
      settings = await BankSettings.create({
        screenshotUrl: '/bank-details-qr.png',
        bankName: 'Al Rajhi Bank',
        accountName: 'TANVIR AHMAD',
        accountNumber: '077040010006081217472',
        iban: 'SA89 8000 0859 6080 1121 7472',
        branchName: '',
        routingNumber: '',
        mobileBanking: '',
        transferInstructions: 'Please transfer the monthly fee to the bank account above or scan the QR code. You can use either the Account Number or IBAN. Enter your name or email as the transfer reference. Once transferred, click "I\'ve transferred the payment" and submit your details. Your payment will be verified within 24 hours.',
      });
    }

    res.json({ bankDetails: settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Update bank details & screenshot (Admin / Web Developer only)
router.put('/bank-details', authMiddleware, requirePermission('manage_roles'), async (req, res) => {
  try {
    const { screenshotUrl, bankName, accountName, accountNumber, iban, branchName, routingNumber, mobileBanking, transferInstructions } = req.body;
    let settings = await BankSettings.findOne().sort({ createdAt: -1 });

    if (!settings) {
      settings = new BankSettings({});
    }

    if (screenshotUrl !== undefined) settings.screenshotUrl = screenshotUrl;
    if (bankName !== undefined) settings.bankName = String(bankName).trim();
    if (accountName !== undefined) settings.accountName = String(accountName).trim();
    if (accountNumber !== undefined) settings.accountNumber = String(accountNumber).trim();
    if (iban !== undefined) settings.iban = String(iban).trim();
    if (branchName !== undefined) settings.branchName = String(branchName).trim();
    if (routingNumber !== undefined) settings.routingNumber = String(routingNumber).trim();
    if (mobileBanking !== undefined) settings.mobileBanking = String(mobileBanking).trim();
    if (transferInstructions !== undefined) settings.transferInstructions = String(transferInstructions).trim();

    settings.updatedBy = req.userId;
    await settings.save();

    res.json({ message: 'Bank details updated successfully.', bankDetails: settings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get student payment status & active notifications
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const email = user.email.toLowerCase();
    const paidMonths = Math.max(Number(user.paidBatchMonths) || 1, 1);

    const existingRecords = await PaymentRecord.find({ userEmail: email }).lean();
    const recordMap = new Map(existingRecords.map(r => [r.month, r]));

    const months = [1, 2, 3, 4, 5].map(monthNum => {
      const existing = recordMap.get(monthNum);
      if (existing) return existing;

      const defaultStatus = monthNum <= paidMonths ? 'received' : 'due';
      return {
        month: monthNum,
        fee: 50,
        currency: 'SAR',
        status: defaultStatus,
        userEmail: email,
        userName: user.name,
      };
    });

    const pendingMonth = months.find(m => m.status === 'pending');
    const dueMonth = months.find(m => m.status === 'due');
    const applicableMonth = pendingMonth?.month || dueMonth?.month || paidMonths;

    const notifications = await PaymentNotification.find({ userEmail: email, isRead: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      paidBatchMonths: paidMonths,
      privateBatchAccess: Boolean(user.privateBatchAccess),
      applicableMonth,
      months,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Student submits transfer details (changes status to 'pending')
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { month, senderName, transferDate, transactionRef, receiptUrl } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const monthNum = Math.min(Math.max(Number(month) || 1, 1), 5);
    const email = user.email.toLowerCase();

    let record = await PaymentRecord.findOne({ userEmail: email, month: monthNum });
    if (!record) {
      record = new PaymentRecord({
        userId: user._id,
        userEmail: email,
        userName: user.name,
        month: monthNum,
        fee: 50,
        currency: 'SAR',
      });
    }

    record.senderName = String(senderName || user.name).trim();
    record.transferDate = String(transferDate || new Date().toISOString().split('T')[0]).trim();
    record.transactionRef = String(transactionRef || '').trim();
    if (receiptUrl) record.receiptUrl = receiptUrl;
    record.status = 'pending'; // MUST NEVER AUTOMATICALLY MARK AS RECEIVED
    record.submittedAt = new Date();

    await record.save();

    res.json({
      message: 'Transfer submitted successfully. Status updated to Pending verification.',
      record,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Admin lists all payment records & verification queue
router.get('/admin/records', authMiddleware, requirePermission('manage_roles'), async (req, res) => {
  try {
    const records = await PaymentRecord.find({})
      .sort({ submittedAt: -1, updatedAt: -1 })
      .lean();

    const users = await User.find({}).select('name email role privateBatchAccess paidBatchMonths').lean();

    res.json({ records, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Admin marks payment as Received or Due
router.post('/admin/confirm', authMiddleware, requirePermission('manage_roles'), async (req, res) => {
  try {
    const { userEmail, month, status, adminNotes } = req.body;
    if (!userEmail || !month) {
      return res.status(400).json({ error: 'userEmail and month are required' });
    }

    const email = String(userEmail).toLowerCase().trim();
    const monthNum = Number(month);
    const newStatus = status === 'received' ? 'received' : 'due';

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Student user not found' });

    let record = await PaymentRecord.findOne({ userEmail: email, month: monthNum });
    if (!record) {
      record = new PaymentRecord({
        userId: user._id,
        userEmail: email,
        userName: user.name,
        month: monthNum,
        fee: 50,
        currency: 'SAR',
      });
    }

    record.status = newStatus;
    if (adminNotes !== undefined) record.adminNotes = String(adminNotes);

    if (newStatus === 'received') {
      record.confirmedAt = new Date();
      if (user.paidBatchMonths < monthNum) {
        user.paidBatchMonths = monthNum;
      }
      user.privateBatchAccess = true;
      user.privateBatchExplicitlyRevoked = false;
      const enrolled = new Set(user.enrolledPathways || []);
      enrolled.add('paid_batch');
      user.enrolledPathways = [...enrolled];
      await user.save();

      await PaymentNotification.create({
        userId: user._id,
        userEmail: email,
        title: `Payment Confirmed — Month ${monthNum}`,
        message: `Payment received — thank you, ${user.name}! Your payment for Month ${monthNum} has been confirmed. Keep up the great work with your learning!`,
        type: 'confirmation',
        month: monthNum,
        isRead: false,
      });
    } else {
      record.confirmedAt = null;
    }

    await record.save();

    res.json({
      message: newStatus === 'received'
        ? `Payment marked as Received for Month ${monthNum}. Classes ${(monthNum - 1) * 12 + 1}–${monthNum * 12} unlocked!`
        : `Payment marked as Due for Month ${monthNum}.`,
      record,
      user: {
        id: user._id,
        email: user.email,
        paidBatchMonths: user.paidBatchMonths,
        privateBatchAccess: user.privateBatchAccess,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Admin sends payment reminder notification
router.post('/admin/remind', authMiddleware, requirePermission('manage_roles'), async (req, res) => {
  try {
    const { userEmail, month } = req.body;
    const email = String(userEmail).toLowerCase().trim();
    const monthNum = Number(month) || 1;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Student not found' });

    const notification = await PaymentNotification.create({
      userId: user._id,
      userEmail: email,
      title: `Tuition Reminder — Month ${monthNum}`,
      message: `Friendly reminder from instructor Tanvir: Your payment for Month ${monthNum} (Classes ${(monthNum - 1) * 12 + 1}–${monthNum * 12}) is currently due. Please view the bank details to complete your transfer.`,
      type: 'reminder',
      month: monthNum,
      isRead: false,
    });

    res.json({ message: `Reminder sent to ${user.name} for Month ${monthNum}.`, notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Dismiss notification
router.post('/notifications/:id/dismiss', authMiddleware, async (req, res) => {
  try {
    const notification = await PaymentNotification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification dismissed.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
