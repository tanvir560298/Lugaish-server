import test from 'node:test';
import assert from 'node:assert/strict';
import { getArabicCourseDay } from './courseLaunch.js';

const learner = start => ({ role: 'learner', arabicStartDate: new Date(start) });

test('increments the Arabic course day at Dhaka midnight', () => {
  const user = learner('2026-08-01T12:00:00.000Z');

  assert.equal(getArabicCourseDay(user, new Date('2026-08-21T17:59:59.999Z')), 4);
  assert.equal(getArabicCourseDay(user, new Date('2026-08-21T18:00:00.000Z')), 5);
});

test('all learners share the same website day regardless of enrollment time', () => {
  const existingLearner = learner('2026-08-01T12:00:00.000Z');
  const newLearner = learner('2026-08-20T17:30:00.000Z');

  assert.equal(getArabicCourseDay(existingLearner, new Date('2026-08-21T17:59:59.999Z')), 4);
  assert.equal(getArabicCourseDay(newLearner, new Date('2026-08-21T17:59:59.999Z')), 4);
});

test('keeps non-learner planning access unchanged', () => {
  assert.equal(getArabicCourseDay({ role: 'tester' }, new Date('2026-08-20T18:00:00.000Z')), 365);
});
