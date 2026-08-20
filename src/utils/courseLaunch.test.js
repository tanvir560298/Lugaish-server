import test from 'node:test';
import assert from 'node:assert/strict';
import { getArabicCourseDay } from './courseLaunch.js';

const learner = start => ({ role: 'learner', arabicStartDate: new Date(start) });

test('increments the Arabic course day at Dhaka midnight', () => {
  const user = learner('2026-08-17T12:00:00.000Z'); // 6:00 PM in Dhaka

  assert.equal(getArabicCourseDay(user, new Date('2026-08-20T17:59:59.999Z')), 4);
  assert.equal(getArabicCourseDay(user, new Date('2026-08-20T18:00:00.000Z')), 5);
});

test('does not wait for the enrollment time before opening the next date', () => {
  const user = learner('2026-08-20T16:58:00.000Z'); // 10:58 PM in Dhaka

  assert.equal(getArabicCourseDay(user, new Date('2026-08-20T17:59:59.999Z')), 1);
  assert.equal(getArabicCourseDay(user, new Date('2026-08-20T18:00:00.000Z')), 2);
});

test('keeps non-learner planning access unchanged', () => {
  assert.equal(getArabicCourseDay({ role: 'tester' }, new Date('2026-08-20T18:00:00.000Z')), 365);
});
