import config from '../config.js';

const DEFAULT_COURSE_START_AT = '2026-08-01T00:00:00+06:00';
const COURSE_TIME_ZONE = 'Asia/Dhaka';
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export function getCourseStartDate() {
  const configuredDate = new Date(config.COURSE_START_AT);
  if (!Number.isNaN(configuredDate.getTime())) return configuredDate;

  return new Date(DEFAULT_COURSE_START_AT);
}

export function isScheduledDayActivity(day, activityAt) {
  const normalizedDay = normalizeDay(day);
  if (!normalizedDay || !activityAt) return false;

  const activityDate = new Date(activityAt);
  if (Number.isNaN(activityDate.getTime())) return false;

  const courseStart = getCourseStartDate();
  const releaseAt = courseStart.getTime() + (normalizedDay - 1) * MILLISECONDS_PER_DAY;
  return activityDate.getTime() >= releaseAt && activityDate.getTime() <= Date.now();
}

function formatDateKey(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: COURSE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function normalizeDay(day) {
  const normalizedDay = Number(day);
  return Number.isSafeInteger(normalizedDay) && normalizedDay > 0 ? normalizedDay : null;
}

export function getCourseSchedule(now = new Date()) {
  const courseStart = getCourseStartDate();
  const elapsed = now.getTime() - courseStart.getTime();
  const courseStarted = elapsed >= 0;

  const calendarDay = courseStarted ? Math.floor(elapsed / MILLISECONDS_PER_DAY) + 1 : 0;

  return {
    courseStarted,
    courseStartAt: courseStart.toISOString(),
    courseStartDate: formatDateKey(courseStart),
    timeZone: COURSE_TIME_ZONE,
    calendarDay,
    courseDay: calendarDay,
  };
}

export function getDaySchedule(day, now = new Date()) {
  const normalizedDay = normalizeDay(day);
  if (!normalizedDay) throw new Error('Day must be a positive integer');

  const courseStart = getCourseStartDate();
  const releaseAt = new Date(courseStart.getTime() + (normalizedDay - 1) * MILLISECONDS_PER_DAY);
  const courseSchedule = getCourseSchedule(now);

  return {
    ...courseSchedule,
    day: normalizedDay,
    releaseAt: releaseAt.toISOString(),
    scheduledFor: formatDateKey(releaseAt),
    isReleased: courseSchedule.courseStarted && courseSchedule.calendarDay >= normalizedDay,
  };
}
