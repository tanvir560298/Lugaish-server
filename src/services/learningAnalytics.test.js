import test from "node:test";
import assert from "node:assert/strict";
import { analyticsOptions, calculateAnalytics } from "./learningAnalytics.js";
import { quizContentKey } from "./personalizedLearning.js";
const lesson = {
  day: 1,
  title: "Fixture",
  quiz: [{ question: "A?", options: ["A", "B"], correctAnswer: 0 }],
};
const now = new Date("2026-10-12T12:00:00Z");
const q = (id, answer, at) => ({
  _id: id,
  day: 1,
  contentKey: quizContentKey(lesson.quiz),
  completedAt: at,
  responses: [
    { questionIndex: 0, selectedAnswer: answer, isCorrect: answer === 0 },
  ],
});
test("first submissions, repeat sessions and review retries have separate denominators and stable deduplication", () => {
  const first = q("q1", 1, "2026-10-10T10:00:00Z"),
    repeat = q("q2", 1, "2026-10-11T10:00:00Z"),
    retry = {
      _id: "r1",
      sourceQuiz: "q2",
      questionIndex: 0,
      selectedAnswer: 0,
      isCorrect: true,
      requestId: "retry1",
      completedAt: "2026-10-12T10:00:00Z",
    };
  const d = calculateAnalytics({
    lessons: [lesson],
    quizzes: [repeat, first, first],
    reviews: [retry, retry],
    options: analyticsOptions({ range: "all" }, now),
  });
  assert.deepEqual(d.metrics, {
    completedLessons: 1,
    practiceSessions: 2,
    questionsAttempted: 2,
    correctAnswers: 0,
  });
  assert.equal(d.accuracy.first.evaluated, 1);
  assert.equal(d.accuracy.repeat.evaluated, 1);
  assert.equal(d.accuracy.review.correct, 1);
  assert.deepEqual(d.review, {
    pending: 0,
    successful: 1,
    total: 1,
    retries: 1,
  });
  assert.equal(d.activity.items.length, 3);
  assert.equal(d.today.reviews, 1);
});
test("time zone boundaries and ranges classify first attempts using all history before filtering", () => {
  const older = q("old", 1, "2026-09-01T10:00:00Z"),
    repeat = q("repeat", 0, "2026-10-11T22:30:00Z");
  const opts = analyticsOptions({ range: "7", zone: "Asia/Riyadh" }, now);
  assert.equal(opts.day(repeat.completedAt), "2026-10-12");
  const d = calculateAnalytics({
    lessons: [lesson],
    quizzes: [repeat, older],
    options: opts,
  });
  assert.equal(d.accuracy.first.evaluated, 0);
  assert.equal(d.accuracy.repeat.correct, 1);
  assert.equal(d.metrics.completedLessons, 0);
  assert.equal(d.today.practice, 1);
  assert.throws(() => analyticsOptions({ range: "9" }, now));
  assert.throws(() => analyticsOptions({ zone: "MadeUp" }, now));
  assert.throws(() => analyticsOptions({ page: 0 }, now));
});
test("missing, changed or incomplete records are excluded; focus remains unavailable and partial totals withheld", () => {
  const invalid = q("bad", 1, "invalid"),
    changed = { ...q("changed", 0, "2026-10-10T10:00:00Z"), contentKey: "old" },
    forged = {
      ...q("forged", 1, "2026-10-10T10:00:00Z"),
      responses: [{ questionIndex: 0, selectedAnswer: 1, isCorrect: true }],
    };
  const d = calculateAnalytics({
    lessons: [lesson],
    quizzes: [invalid, changed, forged],
    options: analyticsOptions({}, now),
  });
  assert.equal(d.coverage.omitted, 3);
  assert.equal(d.metrics.questionsAttempted, 0);
  assert.equal(d.focus.available, false);
  assert.deepEqual(d.timeline, []);
  assert.equal(
    calculateAnalytics({ options: analyticsOptions({}, now), partial: true })
      .metrics,
    null,
  );
});
test("lesson receipts deduplicate days and pagination bounds event output", () => {
  const lessons = [{ day: 2, title: "Reading", quiz: [] }];
  const c = { day: 2, completedAt: "2026-10-10T10:00:00Z" };
  const d = calculateAnalytics({
    lessons,
    progress: [{ completedDays: [c, c] }],
    options: analyticsOptions({}, now),
  });
  assert.equal(d.metrics.completedLessons, 1);
  assert.equal(d.activity.items.length, 1);
  assert.equal(
    calculateAnalytics({ options: analyticsOptions({}, now) }).activity.hasMore,
    false,
  );
});

test('activity pagination and timeline limits do not fabricate days or duplicate completions',()=>{const quizzes=Array.from({length:15},(_,i)=>q('session-'+String(i).padStart(2,'0'),0,new Date(Date.parse('2026-10-01T00:00:00Z')+i*3600000).toISOString()));const one=calculateAnalytics({lessons:[lesson],quizzes,options:analyticsOptions({range:'all'},now)}),two=calculateAnalytics({lessons:[lesson],quizzes,options:analyticsOptions({range:'all',page:2},now)});assert.equal(one.activity.items.length,10);assert.equal(one.activity.hasMore,true);assert.equal(two.activity.items.length,5);assert.equal(two.activity.hasMore,false);assert.equal(new Set([...one.activity.items,...two.activity.items].map(e=>e.id)).size,15);assert.equal(one.metrics.completedLessons,1);assert.deepEqual(one.timeline,[{day:'2026-10-01',count:15}]);});
