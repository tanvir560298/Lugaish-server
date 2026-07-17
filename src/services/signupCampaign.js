import { google } from 'googleapis';
import config from '../config.js';
import { EmailCampaign } from '../models/EmailCampaign.js';
import { EmailDelivery } from '../models/EmailDelivery.js';
import { MailConnection } from '../models/MailConnection.js';
import { decryptSecret } from '../utils/mailCrypto.js';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character]);
}

function createRawMessage({ to, name, subject, message }) {
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  const html = `<p>Hello ${escapeHtml(name || 'Learner')},</p><p>${safeMessage}</p><p>— Lugaish Team</p>`;
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
  return Buffer.from([
    `From: Lugaish <${config.GMAIL_SENDER_EMAIL}>`, `To: ${to}`, `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0', 'Content-Type: text/html; charset=UTF-8', '', html,
  ].join('\r\n')).toString('base64url');
}

async function getGmail() {
  const connection = await MailConnection.findOne({ key: 'primary' });
  if (!connection || connection.senderEmail !== config.GMAIL_SENDER_EMAIL) {
    throw new Error('The approved Gmail sender is not connected');
  }
  const auth = new google.auth.OAuth2(config.GMAIL_CLIENT_ID, config.GMAIL_CLIENT_SECRET, config.GMAIL_REDIRECT_URI);
  auth.setCredentials({ refresh_token: decryptSecret(connection.encryptedRefreshToken) });
  return google.gmail({ version: 'v1', auth });
}

export async function sendActiveSignupCampaign(user) {
  const now = new Date();
  const campaign = await EmailCampaign.findOne({
    autoSendUntil: { $gt: now },
    status: { $in: ['completed', 'partial'] },
  }).sort({ createdAt: -1 });
  if (!campaign) return;

  let delivery;
  try {
    delivery = await EmailDelivery.create({ campaign: campaign._id, user: user._id, email: user.email });
  } catch (error) {
    if (error?.code === 11000) return;
    throw error;
  }

  try {
    const gmail = await getGmail();
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: createRawMessage({ to: user.email, name: user.name, subject: campaign.subject, message: campaign.message }) },
    });
    delivery.status = 'sent';
    delivery.sentAt = new Date();
  } catch (error) {
    delivery.status = 'failed';
    delivery.error = String(error?.message || 'Send failed').slice(0, 300);
  }
  await delivery.save();
}
