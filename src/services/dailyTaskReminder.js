import { google } from 'googleapis';
import config from '../config.js';
import { DailyReminderDelivery } from '../models/DailyReminderDelivery.js';
import { Lesson } from '../models/Lesson.js';
import { MailConnection } from '../models/MailConnection.js';
import { Progress } from '../models/Progress.js';
import { User } from '../models/User.js';
import { getCourseSchedule, getDaySchedule } from '../utils/courseSchedule.js';
import { decryptSecret } from '../utils/mailCrypto.js';
import { ROLES } from '../utils/roles.js';
import { isDayModulePublished } from '../utils/speakingPractice.js';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;',
  })[character]);
}

export function buildDailyReminderEmail({ name, day, language, taskUrl }) {
  const courseName = language === 'arabic' ? 'Arabic' : 'English';
  const subject = `Day ${day} is ready — keep your Lugaish streak going 🚀`;
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.7">
      <p>Hello ${escapeHtml(name || 'Learner')},</p>
      <h2 style="color:#102a56">Your Day ${day} ${courseName} task is ready!</h2>
      <p>Take a few minutes today to complete your new lesson and keep your learning streak moving forward.</p>
      <p>Every small step brings you closer to speaking with clarity and confidence.</p>
      <p style="margin:28px 0"><a href="${escapeHtml(taskUrl)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:13px 22px;border-radius:10px;font-weight:700">Open today’s task</a></p>
      <p>Keep learning, keep growing!</p>
      <p>— The Lugaish Team</p>
    </div>`;
  return { subject, html };
}

function createRawMessage({ to, subject, html }) {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf8').toString('base64')}?=`;
  return Buffer.from([
    `From: Lugaish <${config.GMAIL_SENDER_EMAIL}>`,
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ].join('\r\n')).toString('base64url');
}

async function getGmail() {
  const connection = await MailConnection.findOne({ key: 'primary' });
  if (!connection || connection.senderEmail !== config.GMAIL_SENDER_EMAIL) {
    throw new Error('The approved Gmail sender is not connected');
  }
  const auth = new google.auth.OAuth2(config.GMAIL_CLIENT_ID, config.GMAIL_CLIENT_SECRET, config.GMAIL_REDIRECT_URI);
  auth.setCredentials({ refresh_token: decryptSecret(connection.encryptedRefreshToken) });
  await auth.getAccessToken();
  return google.gmail({ version: 'v1', auth });
}

async function reserveDelivery({ dateKey, day, language, user }) {
  try {
    return await DailyReminderDelivery.create({ dateKey, day, language, user: user._id, email: user.email });
  } catch (error) {
    if (error?.code === 11000) return null;
    throw error;
  }
}

export async function sendDailyTaskReminders({ now = new Date(), gmail: suppliedGmail } = {}) {
  if (!config.DAILY_REMINDER_ENABLED) return { skipped: true, reason: 'Daily reminders are disabled' };

  const schedule = getCourseSchedule(now);
  if (!schedule.courseStarted || schedule.calendarDay < 1) {
    return { skipped: true, reason: 'The course has not started' };
  }

  const day = schedule.calendarDay;
  const dateKey = getDaySchedule(day, now).scheduledFor;
  const lessons = await Lesson.find({ day });
  const liveLanguages = new Set(lessons.filter(isDayModulePublished).map(lesson => lesson.language));
  if (!liveLanguages.size) return { skipped: true, reason: `No published task exists for Day ${day}` };

  const gmail = suppliedGmail ?? await getGmail();
  const summary = { skipped: false, dateKey, day, eligible: 0, sent: 0, failed: 0, duplicates: 0 };

  for (const language of liveLanguages) {
    const users = await User.find({
      role: ROLES.learner,
      enrolledPathways: language,
      email: { $exists: true, $ne: '' },
    }).select('name email');
    const completedUserIds = new Set((await Progress.find({
      language,
      userId: { $in: users.map(user => user._id) },
      completedDays: { $elemMatch: { day } },
    }).select('userId')).map(progress => String(progress.userId)));
    const eligibleUsers = users.filter(user => !completedUserIds.has(String(user._id)));
    summary.eligible += eligibleUsers.length;

    for (const user of eligibleUsers) {
      const delivery = await reserveDelivery({ dateKey, day, language, user });
      if (!delivery) {
        summary.duplicates += 1;
        continue;
      }
      const taskUrl = `${config.FRONTEND_URL.replace(/\/$/, '')}/daily-lessons`;
      const message = buildDailyReminderEmail({ name: user.name, day, language, taskUrl });
      try {
        await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: createRawMessage({ to: user.email, ...message }) },
        });
        delivery.status = 'sent';
        delivery.sentAt = new Date();
        summary.sent += 1;
      } catch (error) {
        delivery.status = 'failed';
        delivery.error = String(error?.message || 'Send failed').slice(0, 300);
        summary.failed += 1;
      }
      await delivery.save();
    }
  }

  return summary;
}
