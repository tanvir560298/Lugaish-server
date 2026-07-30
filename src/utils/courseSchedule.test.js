import assert from 'node:assert/strict';
import test from 'node:test';
import config from '../config.js';
import { getCourseSchedule, getDaySchedule } from './courseSchedule.js';

test('daily lessons release on consecutive Dhaka calendar dates from 1 August 2026', () => {
  const originalStartAt = config.COURSE_START_AT;
  config.COURSE_START_AT = '2026-08-01T00:00:00+06:00';

  try {
    assert.equal(getDaySchedule(1).scheduledFor, '2026-08-01');
    assert.equal(getDaySchedule(2).scheduledFor, '2026-08-02');
    assert.equal(getDaySchedule(3).scheduledFor, '2026-08-03');
  } finally {
    config.COURSE_START_AT = originalStartAt;
  }
});

test('a future day remains unreleased even when its content was uploaded early', () => {
  const originalStartAt = config.COURSE_START_AT;
  config.COURSE_START_AT = '2026-08-01T00:00:00+06:00';

  try {
    const duringDayOne = new Date('2026-08-01T12:00:00+06:00');
    assert.equal(getCourseSchedule(duringDayOne).calendarDay, 1);
    assert.equal(getDaySchedule(1, duringDayOne).isReleased, true);
    assert.equal(getDaySchedule(2, duringDayOne).isReleased, false);
  } finally {
    config.COURSE_START_AT = originalStartAt;
  }
});
