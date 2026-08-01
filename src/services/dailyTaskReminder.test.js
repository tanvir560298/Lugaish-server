import assert from 'node:assert/strict';
import test from 'node:test';
import { buildDailyReminderEmail } from './dailyTaskReminder.js';

test('daily reminder identifies the released task and links to Daily Lessons', () => {
  const email = buildDailyReminderEmail({
    name: 'Tanvir',
    day: 2,
    language: 'english',
    taskUrl: 'https://lugaish.vercel.app/daily-lessons',
  });

  assert.match(email.subject, /Day 2 is ready/);
  assert.match(email.html, /Your Day 2 English task is ready/);
  assert.match(email.html, /https:\/\/lugaish\.vercel\.app\/daily-lessons/);
});

test('daily reminder escapes learner-controlled HTML', () => {
  const email = buildDailyReminderEmail({
    name: '<script>alert(1)</script>',
    day: 1,
    language: 'arabic',
    taskUrl: 'https://example.com/?next=<unsafe>',
  });

  assert.doesNotMatch(email.html, /<script>/);
  assert.match(email.html, /&lt;script&gt;/);
  assert.match(email.html, /Day 1 Arabic task/);
  assert.match(email.html, /next=&lt;unsafe&gt;/);
});
