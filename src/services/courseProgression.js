import { Progress } from '../models/Progress.js';
import { Quiz } from '../models/Quiz.js';

const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

function dhakaDayNumber(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor((date.getTime() + DHAKA_OFFSET_MS) / 86_400_000);
}

export function getNextDhakaMidnight(value = new Date()) {
  const day = dhakaDayNumber(value);
  return new Date((day + 1) * 86_400_000 - DHAKA_OFFSET_MS);
}

export function getContiguousCompletedDay(completedDays = []) {
  const completed = new Set(completedDays.map(Number));
  let day = 0;
  while (completed.has(day + 1)) day += 1;
  return day;
}

export function deriveLearnerDay({ completedDays = [], lastCompletedAt = null, calendarDay = 1, now = new Date() }) {
  const contiguousDay = getContiguousCompletedDay(completedDays);
  if (contiguousDay === 0) return 1;
  const canAdvance = !lastCompletedAt || dhakaDayNumber(now) > dhakaDayNumber(lastCompletedAt);
  return Math.max(1, Math.min(Number(calendarDay) || 1, contiguousDay + (canAdvance ? 1 : 0)));
}

export async function getLearnerProgressState(user, language, calendarDay, now = new Date()) {
  const [progress, quizzes] = await Promise.all([
    Progress.findOne({ userId: user._id, language }),
    Quiz.find({ userId: user._id, language }).select('day completedAt').lean(),
  ]);
  const completionByDay = new Map();
  for (const item of progress?.completedDays ?? []) {
    const day = Number(item.day);
    if (Number.isSafeInteger(day) && day > 0) completionByDay.set(day, item.completedAt || null);
  }
  for (const item of quizzes) {
    const day = Number(item.day);
    if (Number.isSafeInteger(day) && day > 0 && !completionByDay.has(day)) completionByDay.set(day, item.completedAt || null);
  }
  for (const key of user.completionRewards ?? []) {
    const [rewardLanguage, rawDay] = String(key).split(':');
    const day = Number(rawDay);
    if (rewardLanguage === language && Number.isSafeInteger(day) && day > 0 && !completionByDay.has(day)) completionByDay.set(day, null);
  }
  const completedDays = [...completionByDay.keys()].sort((a, b) => a - b);
  const contiguousCompletedDay = getContiguousCompletedDay(completedDays);
  const lastCompletedAt = completionByDay.get(contiguousCompletedDay) || null;
  const currentDay = deriveLearnerDay({ completedDays, lastCompletedAt, calendarDay, now });
  const waitingForMidnight = contiguousCompletedDay > 0 && currentDay === contiguousCompletedDay && currentDay < calendarDay;
  const nextUnlockAt = waitingForMidnight && lastCompletedAt ? getNextDhakaMidnight(lastCompletedAt) : null;

  const savedProgress = await Progress.findOneAndUpdate(
    { userId: user._id, language },
    { $set: { currentDay, nextUnlockAt } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return { progress: savedProgress, completedDays, contiguousCompletedDay, currentDay, nextUnlockAt };
}
