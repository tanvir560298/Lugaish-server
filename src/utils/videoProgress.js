import { isScheduledDayActivity } from './courseSchedule.js';

function normalizeDay(value) {
  const day = Number(value);
  return Number.isSafeInteger(day) && day > 0 ? day : null;
}

function normalizeVideoId(value) {
  if (value === undefined || value === null) return '';
  const id = String(value).trim();
  return id || '';
}

function getLessonVideoIds(lesson) {
  const uniqueIds = new Set();

  for (const video of lesson?.videos ?? []) {
    const id = normalizeVideoId(video?._id);
    if (id) uniqueIds.add(id);
  }

  return [...uniqueIds];
}

function getCompletionEntries(progress, day) {
  const normalizedDay = normalizeDay(day);
  if (!normalizedDay) return [];

  return (progress?.videoCompletions ?? []).filter(entry => Number(entry?.day) === normalizedDay);
}

function getCompletedVideoIds(progress, day, activeVideoIds) {
  const activeIds = new Set(activeVideoIds);
  const completedIds = new Set();
  const entries = getCompletionEntries(progress, day)
    .filter(entry => isScheduledDayActivity(day, entry?.completedAt));

  for (const entry of entries) {
    for (const videoId of entry?.completedVideoIds ?? []) {
      const normalizedId = normalizeVideoId(videoId);
      if (activeIds.has(normalizedId)) completedIds.add(normalizedId);
    }
  }

  return [...completedIds];
}

export function getLessonVideoProgress(lesson, progress) {
  const videoIds = getLessonVideoIds(lesson);
  const completedVideoIds = getCompletedVideoIds(progress, lesson?.day, videoIds);
  const completedSet = new Set(completedVideoIds);
  const nextVideoId = videoIds.find(videoId => !completedSet.has(videoId)) ?? null;

  return {
    enabled: videoIds.length > 0,
    totalVideos: videoIds.length,
    completedVideoIds,
    nextVideoId,
    allCompleted: nextVideoId === null,
    canCompleteDay: videoIds.length === 0 || nextVideoId === null,
  };
}

export function recordLessonVideoCompletion(progress, day, videoId) {
  const normalizedDay = normalizeDay(day);
  const normalizedVideoId = normalizeVideoId(videoId);
  if (!progress || !normalizedDay || !normalizedVideoId) {
    throw new Error('A valid progress record, day, and video ID are required');
  }

  if (!Array.isArray(progress.videoCompletions)) progress.videoCompletions = [];

  let entry = getCompletionEntries(progress, normalizedDay)
    .find(existingEntry => isScheduledDayActivity(normalizedDay, existingEntry?.completedAt));
  if (!entry) {
    entry = { day: normalizedDay, completedVideoIds: [], completedAt: new Date() };
    progress.videoCompletions.push(entry);
    entry = getCompletionEntries(progress, normalizedDay)
      .find(existingEntry => isScheduledDayActivity(normalizedDay, existingEntry?.completedAt)) ?? entry;
  }

  const completedVideoIds = Array.isArray(entry.completedVideoIds) ? entry.completedVideoIds : [];
  if (completedVideoIds.some(id => normalizeVideoId(id) === normalizedVideoId)) return false;

  entry.completedVideoIds = [...completedVideoIds, normalizedVideoId];
  if (typeof progress.markModified === 'function') progress.markModified('videoCompletions');
  return true;
}
