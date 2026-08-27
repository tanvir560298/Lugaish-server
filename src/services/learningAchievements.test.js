import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDailyStreak, getEligibleMilestones, getReachedMilestones } from './learningAchievements.js';

test('certificate milestones require every day in the milestone range', () => {
  assert.deepEqual(getEligibleMilestones([1, 2, 3, 4, 5, 6, 7]), [7]);
  assert.deepEqual(getEligibleMilestones([1, 2, 3, 5, 6, 7]), []);
  assert.deepEqual(getEligibleMilestones(Array.from({ length: 14 }, (_, index) => index + 1)), [7, 14]);
});

test('cohort milestones unlock when the Bangladesh course calendar reaches them', () => {
  assert.deepEqual(getReachedMilestones(6), []);
  assert.deepEqual(getReachedMilestones(9), [7]);
  assert.deepEqual(getReachedMilestones(14), [7, 14]);
});

test('daily streak follows Bangladesh calendar days and tolerates today being unfinished', () => {
  const now = new Date('2026-08-26T12:00:00.000Z');
  assert.equal(calculateDailyStreak([
    new Date('2026-08-23T08:00:00.000Z'),
    new Date('2026-08-24T08:00:00.000Z'),
    new Date('2026-08-25T08:00:00.000Z'),
  ], now), 3);
  assert.equal(calculateDailyStreak([new Date('2026-08-26T10:00:00.000Z')], now), 1);
});
