import { Progress } from '../models/Progress.js';
import { isScheduledDayActivity } from './courseSchedule.js';

function toPositiveDay(value) {
  const day = Number(value);
  return Number.isSafeInteger(day) && day > 0 ? day : null;
}

function getCompletionDayState(entries) {
  const completedDays = new Set();
  const ignoredPreLaunchDays = new Set();

  for (const entry of entries ?? []) {
    const day = toPositiveDay(typeof entry === 'object' ? entry?.day : entry);
    if (!day) continue;

    // Legacy User.completedLessons values and older Progress records do not
    // prove when a completion happened, so they are never allowed to unlock a
    // new course before/after launch. Entries recorded before their own day
    // release are treated the same way. Preserve them in MongoDB but ignore
    // them for the active daily schedule.
    const completedAt = typeof entry === 'object' ? entry?.completedAt : null;
    if (!isScheduledDayActivity(day, completedAt)) {
      ignoredPreLaunchDays.add(day);
      continue;
    }

    completedDays.add(day);
  }

  return {
    completedDays: [...completedDays].sort((first, second) => first - second),
    ignoredPreLaunchDays: [...ignoredPreLaunchDays].sort((first, second) => first - second),
  };
}

function normalizeCompletedDays(entries) {
  return getCompletionDayState(entries).completedDays;
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
  // The original User.completedLessons array has no completion timestamps.
  // It cannot safely be credited to an August 2026 course day, so preserve it
  // as legacy data but always begin the server-controlled schedule at Day 1.
  return [];
}

function getIgnoredLegacyCompletedDays(user, language) {
  if (!canMigrateLegacyProgress(user, language)) return [];

  const days = new Set();
  for (const entry of user?.completedLessons ?? []) {
    const day = toPositiveDay(entry);
    if (day) days.add(day);
  }
  return [...days].sort((first, second) => first - second);
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
  const completionState = progress ? getCompletionDayState(progress.completedDays) : null;
  const completedDays = completionState?.completedDays ?? getLegacyCompletedDays(user, language);
  const ignoredPreLaunchDays = completionState?.ignoredPreLaunchDays ?? getIgnoredLegacyCompletedDays(user, language);

  return {
    progress,
    completedDays,
    ignoredPreLaunchDays,
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
    try {
      progress = await createProgressDocument(user, language, currentState.completedDays).save();
    } catch (error) {
      // A parallel request may have created the unique language ledger first.
      if (error?.code !== 11000) throw error;
      progress = await Progress.findOne({ userId: user._id, language });
    }
  }

  const activeCompletedDays = normalizeCompletedDays(progress.completedDays);
  const alreadyCompleted = activeCompletedDays.includes(normalizedDay);
  let didAwardXP = false;
  if (!alreadyCompleted) {
    const now = new Date();
    const previousVersion = Number(progress.__v) || 0;
    const updatedProgress = await Progress.findOneAndUpdate(
      { _id: progress._id, __v: previousVersion },
      {
        $push: {
          completedDays: {
            day: normalizedDay,
            completedAt: now,
            score: Number.isFinite(Number(score)) ? Number(score) : 0,
          },
        },
        $inc: { totalXP: 100, __v: 1 },
        $set: { lastActiveDate: now },
      },
      { new: true, runValidators: true },
    );

    if (updatedProgress) {
      user.totalXP = Math.max(Number(user.totalXP) || 0, 0) + 100;
      updateUserStreak(user, now);
      updatedProgress.streak = user.streak;
      await Promise.all([updatedProgress.save(), user.save()]);
      progress = updatedProgress;
      didAwardXP = true;
    } else {
      // Another request changed this ledger first. Re-read it instead of
      // awarding XP twice; its completed-day entry is now authoritative.
      progress = await Progress.findById(progress._id);
    }
  }

  const completedDays = normalizeCompletedDays(progress.completedDays);
  const completionRecorded = completedDays.includes(normalizedDay);
  return {
    progress,
    completedDays,
    currentDay: getNextUncompletedDay(completedDays),
    alreadyCompleted: alreadyCompleted || !didAwardXP,
    xpAwarded: didAwardXP && completionRecorded ? 100 : 0,
  };
}
