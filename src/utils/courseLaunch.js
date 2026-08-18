import { ROLES, normalizeRole } from './roles.js';

export function getArabicCourseDay(user) {
  if (!user) return 365;

  const role = normalizeRole(user.role);
  if (role !== ROLES.learner) {
    return 365;
  }

  const startDate = user.arabicStartDate || user.createdAt || new Date();
  const msDiff = Date.now() - new Date(startDate).getTime();
  const daysDiff = Math.floor(msDiff / (24 * 60 * 60 * 1000));
  return Math.max(1, daysDiff + 1);
}
