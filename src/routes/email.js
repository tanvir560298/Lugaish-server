import express from 'express';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import config from '../config.js';
import { authMiddleware } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { MailConnection } from '../models/MailConnection.js';
import { EmailCampaign } from '../models/EmailCampaign.js';
import { decryptSecret, encryptSecret } from '../utils/mailCrypto.js';
import { hasPermission } from '../utils/roles.js';

const router = express.Router();
const emailManagerEmails = new Set(config.EMAIL_MANAGER_EMAILS.split(',').map(email => email.trim().toLowerCase()).filter(Boolean));

function canManageEmail(user) {
  return Boolean(user
    && hasPermission(user.role, 'manage_email')
    && emailManagerEmails.has(String(user.email || '').toLowerCase()));
}

async function requireEmailManager(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('role email');
    if (!canManageEmail(user)) return res.status(403).json({ error: 'Only the approved Web Developer can manage email' });
    req.emailManager = user;
    return next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const manageEmail = [authMiddleware, requireEmailManager];
const MAX_RECIPIENTS_PER_CAMPAIGN = 100;
const campaignLocks = new Set();

function getOAuthClient() {
  if (!config.GMAIL_CLIENT_ID || !config.GMAIL_CLIENT_SECRET || !config.GMAIL_REDIRECT_URI) {
    throw new Error('Gmail OAuth environment variables are not configured');
  }
  return new google.auth.OAuth2(config.GMAIL_CLIENT_ID, config.GMAIL_CLIENT_SECRET, config.GMAIL_REDIRECT_URI);
}

function encodeHeader(value) {
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character]);
}

function createRawMessage({ to, name, subject, message }) {
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const safeName = escapeHtml(name || 'Learner');
  const html = `<p>Hello ${safeName},</p><p>${safeMessage}</p><p>— Lugaish Team</p>`;
  const mime = [
    `From: Lugaish <${config.GMAIL_SENDER_EMAIL}>`, `To: ${to}`, `Subject: ${encodeHeader(subject)}`,
    'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', html,
  ].join('\r\n');
  return Buffer.from(mime).toString('base64url');
}

async function getAuthorizedGmail() {
  const connection = await MailConnection.findOne({ key: 'primary' });
  if (!connection) throw new Error('Gmail sender is not connected');
  if (connection.senderEmail !== config.GMAIL_SENDER_EMAIL) {
    throw new Error(`Reconnect the approved sender: ${config.GMAIL_SENDER_EMAIL}`);
  }
  const auth = getOAuthClient();
  auth.setCredentials({ refresh_token: decryptSecret(connection.encryptedRefreshToken) });
  return google.gmail({ version: 'v1', auth });
}

router.get('/status', ...manageEmail, async (req, res) => {
  try {
    const connection = await MailConnection.findOne({ key: 'primary' }).select('senderEmail connectedAt');
    const recentCampaigns = await EmailCampaign.find({})
      .select('subject recipientCount sentCount failedCount status createdAt').sort({ createdAt: -1 }).limit(10);
    const connected = connection?.senderEmail === config.GMAIL_SENDER_EMAIL;
    res.json({
      configured: Boolean(config.GMAIL_CLIENT_ID && config.GMAIL_CLIENT_SECRET && config.GMAIL_TOKEN_ENCRYPTION_KEY),
      connected, senderEmail: config.GMAIL_SENDER_EMAIL,
      connectedAt: connected ? connection.connectedAt : null, maxRecipientsPerCampaign: MAX_RECIPIENTS_PER_CAMPAIGN, recentCampaigns,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/oauth/url', ...manageEmail, (req, res) => {
  try {
    const state = jwt.sign({ userId: req.userId, purpose: 'gmail_connect' }, config.JWT_SECRET, { expiresIn: '10m' });
    const url = getOAuthClient().generateAuthUrl({
      access_type: 'offline', prompt: 'consent',
      scope: ['openid', 'email', 'https://www.googleapis.com/auth/gmail.send'], state,
    });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/oauth/callback', async (req, res) => {
  try {
    const payload = jwt.verify(String(req.query.state || ''), config.JWT_SECRET);
    if (payload.purpose !== 'gmail_connect') throw new Error('Invalid OAuth state');
    const user = await User.findById(payload.userId).select('role email');
    if (!canManageEmail(user)) throw new Error('You no longer have permission to connect Gmail');
    const { tokens } = await getOAuthClient().getToken(String(req.query.code || ''));
    if (!tokens.refresh_token) throw new Error('Google did not return a refresh token. Reconnect and approve access again.');
    if (!tokens.id_token) throw new Error('Google did not return account identity. Reconnect and approve access again.');
    const ticket = await getOAuthClient().verifyIdToken({
      idToken: tokens.id_token,
      audience: config.GMAIL_CLIENT_ID,
    });
    const connectedEmail = String(ticket.getPayload()?.email || '').trim().toLowerCase();
    if (connectedEmail !== config.GMAIL_SENDER_EMAIL) {
      throw new Error(`Choose ${config.GMAIL_SENDER_EMAIL} when connecting Gmail`);
    }
    await MailConnection.findOneAndUpdate({ key: 'primary' }, {
      key: 'primary', senderEmail: config.GMAIL_SENDER_EMAIL,
      encryptedRefreshToken: encryptSecret(tokens.refresh_token), connectedBy: user._id, connectedAt: new Date(),
    }, { upsert: true, new: true });
    res.redirect(`${config.FRONTEND_URL.replace(/\/$/, '')}/dashboard?mail=connected`);
  } catch (error) {
    res.redirect(`${config.FRONTEND_URL.replace(/\/$/, '')}/dashboard?mailError=${encodeURIComponent(error.message || 'Gmail connection failed')}`);
  }
});

router.post('/send-test', ...manageEmail, async (req, res) => {
  try {
    const recipient = String(req.body.email || '').trim().toLowerCase();
    const subject = String(req.body.subject || '').trim().slice(0, 150);
    const message = String(req.body.message || '').trim().slice(0, 10000);
    if (!/^\S+@\S+\.\S+$/.test(recipient) || !subject || !message) {
      return res.status(400).json({ error: 'A valid recipient, subject, and message are required' });
    }
    const gmail = await getAuthorizedGmail();
    await gmail.users.messages.send({ userId: 'me', requestBody: { raw: createRawMessage({ to: recipient, name: 'Test recipient', subject, message }) } });
    return res.json({ message: `Test email sent to ${recipient}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/campaigns', ...manageEmail, async (req, res) => {
  try {
    const subject = String(req.body.subject || '').trim().slice(0, 150);
    const message = String(req.body.message || '').trim().slice(0, 10000);
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });
    if (String(req.body.confirmation || '') !== 'SEND TO ALL USERS') return res.status(400).json({ error: 'Campaign confirmation text does not match' });
    const lockKey = String(req.userId);
    if (campaignLocks.has(lockKey)) return res.status(409).json({ error: 'Another campaign is already sending. Wait for it to finish.' });
    campaignLocks.add(lockKey);
    try {
      const users = await User.find({ email: { $exists: true, $ne: '' } }).select('name email').sort({ createdAt: 1 }).limit(MAX_RECIPIENTS_PER_CAMPAIGN + 1);
      if (users.length > MAX_RECIPIENTS_PER_CAMPAIGN) return res.status(409).json({ error: `Safety limit is ${MAX_RECIPIENTS_PER_CAMPAIGN} recipients per campaign. Use a dedicated bulk email provider for larger lists.` });
      if (!users.length) return res.status(400).json({ error: 'No recipients found' });
      const campaign = await EmailCampaign.create({ subject, message, senderEmail: config.GMAIL_SENDER_EMAIL, createdBy: req.userId, recipientCount: users.length });
      const gmail = await getAuthorizedGmail();
      const failures = [];
      let sentCount = 0;
      for (let index = 0; index < users.length; index += 3) {
        const batch = users.slice(index, index + 3);
        const results = await Promise.allSettled(batch.map(user => gmail.users.messages.send({
          userId: 'me', requestBody: { raw: createRawMessage({ to: user.email, name: user.name, subject, message }) },
        })));
        results.forEach((result, resultIndex) => {
          if (result.status === 'fulfilled') sentCount += 1;
          else failures.push({ email: batch[resultIndex].email, error: String(result.reason?.message || 'Send failed').slice(0, 300) });
        });
      }
      campaign.sentCount = sentCount;
      campaign.failedCount = failures.length;
      campaign.failures = failures;
      campaign.status = failures.length === 0 ? 'completed' : sentCount ? 'partial' : 'failed';
      await campaign.save();
      return res.json({ message: `Sent ${sentCount} of ${users.length} emails`, campaign });
    } finally {
      campaignLocks.delete(lockKey);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/campaigns/latest/activate-signup', ...manageEmail, async (req, res) => {
  try {
    const deadline = new Date('2026-07-18T15:00:00.000Z');
    if (deadline <= new Date()) return res.status(400).json({ error: 'The automatic signup campaign deadline has passed' });
    const campaign = await EmailCampaign.findOne({ status: { $in: ['completed', 'partial'] } }).sort({ createdAt: -1 });
    if (!campaign) return res.status(404).json({ error: 'Send the campaign once before enabling automatic delivery' });
    campaign.autoSendUntil = deadline;
    await campaign.save();
    return res.json({ message: 'New users will receive this campaign automatically until 18 July 2026, 9:00 PM (Bangladesh time)' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
