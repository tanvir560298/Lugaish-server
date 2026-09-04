import { Progress } from '../models/Progress.js';
import { Quiz } from '../models/Quiz.js';

export const CERTIFICATE_MILESTONES = [7, 14, 21, 30];
const dhakaDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit',
});

function calendarDay(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = Object.fromEntries(dhakaDateFormatter.formatToParts(date)
    .filter(part => part.type !== 'literal').map(part => [part.type, Number(part.value)]));
  return Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000);
}

export async function getCompletedCourseDays(user, language) {
  const [progress, quizEntries] = await Promise.all([
    Progress.findOne({ userId: user._id, language }).select('completedDays').lean(),
    Quiz.find({ userId: user._id, language }).select('day completedAt').lean(),
  ]);
  const rewardPrefix = `${language}:`;
  const rewardedDays = (user.completionRewards ?? [])
    .filter(key => typeof key === 'string' && key.startsWith(rewardPrefix))
    .map(key => Number(key.slice(rewardPrefix.length)));
  const progressDays = (progress?.completedDays ?? []).map(item => Number(item.day));
  const quizDays = quizEntries.map(item => Number(item.day));
  const impliedPdfDays = quizDays.filter(day => Number.isSafeInteger(day) && day > 1 && day % 2 === 0).map(day => day - 1);

  return [...new Set([...rewardedDays, ...progressDays, ...quizDays, ...impliedPdfDays])]
    .filter(day => Number.isSafeInteger(day) && day > 0)
    .sort((a, b) => a - b);
}

export function getEligibleMilestones(completedDays) {
  const completed = new Set(completedDays);
  return CERTIFICATE_MILESTONES.filter(milestone => (
    Array.from({ length: milestone }, (_, index) => index + 1).every(day => completed.has(day))
  ));
}

export async function getLearningActivityDates(userId, languages) {
  const [progressEntries, quizEntries] = await Promise.all([
    Progress.find({ userId, language: { $in: languages } }).select('completedDays.completedAt').lean(),
    Quiz.find({ userId, language: { $in: languages } }).select('completedAt').lean(),
  ]);
  return [
    ...progressEntries.flatMap(progress => (progress.completedDays ?? []).map(item => item.completedAt)),
    ...quizEntries.map(item => item.completedAt),
  ].filter(Boolean);
}

export function calculateDailyStreak(activityDates, now = new Date()) {
  const activeDays = new Set(activityDates.map(calendarDay).filter(Number.isInteger));
  const today = calendarDay(now);
  if (today === null || activeDays.size === 0) return 0;
  let cursor = activeDays.has(today) ? today : today - 1;
  let streak = 0;
  while (activeDays.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}
