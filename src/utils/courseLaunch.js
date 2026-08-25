import { ROLES, normalizeRole } from './roles.js';

const COURSE_TIME_ZONE = 'Asia/Dhaka';
// All Arabic learners follow the same website-wide calendar. In Bangladesh,
// 18 August 2026 is Day 1, so 21 August is Day 4.
const ARABIC_COURSE_START_DATE = '2026-08-18';
// English is a shared daily cohort as well. Using the account creation date
// here used to expose the whole course to older accounts.
export const ENGLISH_COURSE_START_DATE = '2026-08-24';
const dhakaDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: COURSE_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function getDhakaCalendarDayNumber(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = Object.fromEntries(
    dhakaDateFormatter.formatToParts(date)
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, Number(part.value)]),
  );

  return Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / (24 * 60 * 60 * 1000));
}

export function getArabicCourseDay(user, now = new Date()) {
  if (!user) return 365;

  const role = normalizeRole(user.role);
  if (role !== ROLES.learner) {
    return 365;
  }

  const startDate = ARABIC_COURSE_START_DATE;
  const startCalendarDay = getDhakaCalendarDayNumber(startDate);
  const currentCalendarDay = getDhakaCalendarDayNumber(now);
  if (startCalendarDay === null || currentCalendarDay === null) return 1;

  // Course days follow Bangladesh calendar dates. A new day therefore opens
  // at 12:00 AM in Dhaka, rather than 24 hours after the enrollment timestamp.
  return Math.max(1, currentCalendarDay - startCalendarDay + 1);
}

export function getEnglishCourseDay(user, now = new Date()) {
  if (!user) return 365;

  const role = normalizeRole(user.role);
  if (role !== ROLES.learner) {
    return 365;
  }

  const startCalendarDay = getDhakaCalendarDayNumber(ENGLISH_COURSE_START_DATE);
  const currentCalendarDay = getDhakaCalendarDayNumber(now);
  if (startCalendarDay === null || currentCalendarDay === null) return 1;

  return Math.max(1, currentCalendarDay - startCalendarDay + 1);
}
