import test from 'node:test';
import assert from 'node:assert/strict';
import { getArabicCourseDay, getEnglishCourseDay } from './courseLaunch.js';

const learner = start => ({ role: 'learner', arabicStartDate: new Date(start) });

test('increments the Arabic course day at Dhaka midnight', () => {
  const user = learner('2026-08-01T12:00:00.000Z');

  assert.equal(getArabicCourseDay(user, new Date('2026-08-25T17:59:59.999Z')), 7);
  assert.equal(getArabicCourseDay(user, new Date('2026-08-25T18:00:00.000Z')), 8);
});

test('all learners share the same website day regardless of enrollment time', () => {
  const existingLearner = learner('2026-08-01T12:00:00.000Z');
  const newLearner = learner('2026-08-20T17:30:00.000Z');

  assert.equal(getArabicCourseDay(existingLearner, new Date('2026-08-25T17:59:59.999Z')), 7);
  assert.equal(getArabicCourseDay(newLearner, new Date('2026-08-25T17:59:59.999Z')), 7);
});

test('keeps non-learner planning access unchanged', () => {
  assert.equal(getArabicCourseDay({ role: 'tester' }, new Date('2026-08-20T18:00:00.000Z')), 365);
});

test('English starts at day one for every learner on 25 August 2026', () => {
  const oldAccount = { role: 'learner', createdAt: new Date('2025-01-01T00:00:00.000Z') };
  assert.equal(getEnglishCourseDay(oldAccount, new Date('2026-08-25T17:59:59.999Z')), 1);
  assert.equal(getEnglishCourseDay(oldAccount, new Date('2026-08-25T18:00:00.000Z')), 2);
});

test('shows Arabic day 7 and English day 1 on 25 August 2026 in Dhaka', () => {
  const student = { role: 'learner' };
  const duringFirstEnglishDay = new Date('2026-08-25T12:00:00.000Z');
  assert.equal(getArabicCourseDay(student, duringFirstEnglishDay), 7);
  assert.equal(getEnglishCourseDay(student, duringFirstEnglishDay), 1);
});
