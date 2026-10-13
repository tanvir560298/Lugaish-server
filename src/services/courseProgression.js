import { Course } from "../models/Course.js";
import { Progress } from "../models/Progress.js";
import { Quiz } from "../models/Quiz.js";

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

export function deriveLearnerDay({
  completedDays = [],
  lastCompletedAt = null,
  calendarDay = 1,
  now = new Date(),
}) {
  const contiguousDay = getContiguousCompletedDay(completedDays);
  if (contiguousDay === 0) return 1;
  const canAdvance =
    !lastCompletedAt || dhakaDayNumber(now) > dhakaDayNumber(lastCompletedAt);
  return Math.max(
    1,
    Math.min(Number(calendarDay) || 1, contiguousDay + (canAdvance ? 1 : 0)),
  );
}

export async function getLearnerProgressState(
  user,
  language,
  calendarDay,
  now = new Date(),
) {
  const course = await Course.findOne({ language, status: "published" })
    .select("generation")
    .lean();
  const courseGeneration = course?.generation;
  if (!courseGeneration)
    return {
      progress: null,
      completedDays: [],
      contiguousCompletedDay: 0,
      currentDay: 1,
      nextUnlockAt: null,
    };
  const [progressEntries, quizzes] = await Promise.all([
    Progress.find({ userId: user._id, language, courseGeneration })
      .limit(11)
      .select("completedDays")
      .lean(),
    // Repeated attempts must not grow the progression response indefinitely.
    // The earliest verified completion for each day controls its unlock date.
    Quiz.aggregate([
      {
        $match: {
          userId: user._id,
          language,
          courseGeneration,
          day: { $gte: 1, $lte: 365 },
        },
      },
      { $group: { _id: "$day", completedAt: { $min: "$completedAt" } } },
      { $project: { _id: 0, day: "$_id", completedAt: 1 } },
      { $limit: 365 },
    ]).option({ maxTimeMS: 5000 }),
  ]);
  if (progressEntries.length > 10)
    throw new Error("Progress records require reconciliation");
  const completionByDay = new Map();
  const recordCompletion = (value, completedAt) => {
    const day = Number(value);
    if (!Number.isSafeInteger(day) || day < 1 || day > 365) return;
    const parsed = completedAt ? new Date(completedAt) : null;
    const candidate = parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
    const previous = completionByDay.get(day);
    if (!completionByDay.has(day)) completionByDay.set(day, candidate);
    else if (
      candidate &&
      !Number.isNaN(candidate.getTime()) &&
      (!previous || candidate < previous)
    )
      completionByDay.set(day, candidate);
  };
  for (const item of progressEntries.flatMap(
    (entry) => entry.completedDays ?? [],
  )) {
    recordCompletion(item.day, item.completedAt);
  }
  for (const item of quizzes) {
    recordCompletion(item.day, item.completedAt);
  }
  for (const key of user.completionRewards ?? []) {
    const [generation, rewardLanguage, rawDay] = String(key).split(":");
    const day = Number(rawDay);
    if (
      generation === courseGeneration &&
      rewardLanguage === language &&
      Number.isSafeInteger(day) &&
      day > 0 &&
      !completionByDay.has(day)
    )
      completionByDay.set(day, null);
  }
  const completedDays = [...completionByDay.keys()].sort((a, b) => a - b);
  const contiguousCompletedDay = getContiguousCompletedDay(completedDays);
  const lastCompletedAt = completionByDay.get(contiguousCompletedDay) || null;
  const currentDay = deriveLearnerDay({
    completedDays,
    lastCompletedAt,
    calendarDay,
    now,
  });
  const waitingForMidnight =
    contiguousCompletedDay > 0 &&
    currentDay === contiguousCompletedDay &&
    currentDay < calendarDay;
  const nextUnlockAt =
    waitingForMidnight && lastCompletedAt
      ? getNextDhakaMidnight(lastCompletedAt)
      : null;

  const savedProgress = await Progress.findOneAndUpdate(
    { userId: user._id, language, courseGeneration },
    { $set: { currentDay, nextUnlockAt } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return {
    progress: savedProgress,
    completedDays,
    contiguousCompletedDay,
    currentDay,
    nextUnlockAt,
  };
}
