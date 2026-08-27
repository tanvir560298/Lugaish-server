import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveLearnerDay, getContiguousCompletedDay, getNextDhakaMidnight } from './courseProgression.js';

test('sequential progress stops at the first incomplete day', () => {
  assert.equal(getContiguousCompletedDay([1, 2, 4, 5]), 2);
  assert.equal(deriveLearnerDay({ completedDays: [2, 3, 7], calendarDay: 9 }), 1);
});

test('next day opens only on the next Bangladesh calendar date', () => {
  const completedAt = new Date('2026-08-27T12:00:00.000Z');
  assert.equal(deriveLearnerDay({ completedDays: [1], lastCompletedAt: completedAt, calendarDay: 9, now: new Date('2026-08-27T17:59:59.000Z') }), 1);
  assert.equal(deriveLearnerDay({ completedDays: [1], lastCompletedAt: completedAt, calendarDay: 9, now: new Date('2026-08-27T18:00:00.000Z') }), 2);
  assert.equal(getNextDhakaMidnight(completedAt).toISOString(), '2026-08-27T18:00:00.000Z');
});

test('student progress never runs ahead of the published cohort calendar', () => {
  assert.equal(deriveLearnerDay({ completedDays: [1, 2, 3], calendarDay: 2 }), 2);
});
