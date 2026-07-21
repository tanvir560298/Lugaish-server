import { Progress } from '../models/Progress.js';

function toPositiveDay(value) {
  const day = Number(value);
  return Number.isSafeInteger(day) && day > 0 ? day : null;
}

function normalizeCompletedDays(entries) {
  const days = new Set();

  for (const entry of entries ?? []) {
    const day = toPositiveDay(typeof entry === 'object' ? entry?.day : entry);
    if (day) days.add(day);
  }

  return [...days].sort((first, second) => first - second);
}

function getNextUncompletedDay(completedDays) {
  const completed = new Set(completedDays);
  let day = 1;

  while (completed.has(day)) day += 1;
  return day;
}

function canMigrateLegacyProgress(user, language) {
  // The previous data model had one global course day. It can only safely be
  // attributed to the learner's selected language; all other languages start
  // at Day 1 instead of inheriting an unrelated course's progress.
  return user?.languageSelected === language;
}

function getLegacyCompletedDays(user, language) {
  return canMigrateLegacyProgress(user, language)
    ? normalizeCompletedDays(user?.completedLessons)
    : [];
}

function createProgressDocument(user, language, completedDays) {
  return new Progress({
    userId: user._id,
    language,
    completedDays: completedDays.map(day => ({ day, completedAt: new Date() })),
  });
}

function updateUserStreak(user, now) {
  const lastActive = user?.lastActiveDate ? new Date(user.lastActiveDate) : null;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const dayDifference = lastActive && !Number.isNaN(lastActive.getTime())
    ? Math.floor((now - lastActive) / millisecondsPerDay)
    : null;

  if (dayDifference === 1) {
    user.streak = Math.max(Number(user.streak) || 0, 0) + 1;
  } else if (dayDifference && dayDifference > 1) {
    user.streak = 1;
  } else if (!Number(user.streak)) {
    user.streak = 1;
  }

  user.lastActiveDate = now;
}

export function getCurrentDay(completedDays) {
  return getNextUncompletedDay(normalizeCompletedDays(completedDays));
}

export async function getLanguageProgressState(user, language) {
  const progress = await Progress.findOne({ userId: user._id, language });
  const completedDays = progress
    ? normalizeCompletedDays(progress.completedDays)
    : getLegacyCompletedDays(user, language);

  return {
    progress,
    completedDays,
    currentDay: getNextUncompletedDay(completedDays),
  };
}

// Some learner actions (such as completing an individual playlist video) need
// a language-specific progress document before the whole day is complete. Keep
// the same cautious legacy migration used by markLanguageDayCompleted.
export async function getLanguageProgressForWrite(user, language) {
  const state = await getLanguageProgressState(user, language);
  if (state.progress) return state;

  return {
    ...state,
    progress: createProgressDocument(user, language, state.completedDays),
  };
}

export async function markLanguageDayCompleted({ user, language, day, score = 0 }) {
  const normalizedDay = toPositiveDay(day);
  if (!normalizedDay) throw new Error('Day must be a positive integer');

  const currentState = await getLanguageProgressState(user, language);
  let progress = currentState.progress;

  if (!progress) {
    progress = createProgressDocument(user, language, currentState.completedDays);
  }

  const alreadyCompleted = progress.completedDays.some(entry => entry.day === normalizedDay);
  if (!alreadyCompleted) {
    const now = new Date();
    progress.completedDays.push({
      day: normalizedDay,
      completedAt: now,
      score: Number.isFinite(Number(score)) ? Number(score) : 0,
    });
    progress.totalXP = Math.max(Number(progress.totalXP) || 0, 0) + 100;
    progress.lastActiveDate = now;
    progress.streak = Math.max(Number(user.streak) || 0, 0);

    user.totalXP = Math.max(Number(user.totalXP) || 0, 0) + 100;
    updateUserStreak(user, now);
    progress.streak = user.streak;

    await Promise.all([progress.save(), user.save()]);
  } else if (progress.isNew) {
    // Persist a one-time legacy migration even when the requested day was
    // completed before language-specific progress existed.
    await progress.save();
  }

  const completedDays = normalizeCompletedDays(progress.completedDays);
  return {
    progress,
    completedDays,
    currentDay: getNextUncompletedDay(completedDays),
    alreadyCompleted,
  };
}
