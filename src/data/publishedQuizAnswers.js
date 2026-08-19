// Stable answer keys for the published Arabic quizzes. These are also present
// in seed.js, but keeping the scoring keys in application code lets existing
// production databases submit newly published quizzes without a destructive
// database reseed.
const ARABIC_QUIZ_ANSWERS = new Map([
  [2, [1, 3, 1, 0, 2, 2, 3, 1, 1, 1]],
  [4, [1, 2, 1, 2, 1, 2, 1, 1, 0, 2]],
  [6, [1, 2, 1, 1, 2, 1, 3, 0, 2, 1]],
  [8, [1, 2, 1, 2, 2, 1, 3, 2, 1, 1]],
  [10, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]],
  [12, [1, 1, 1, 2, 1, 1, 0, 1, 1, 0]],
  [14, [1, 1, 1, 0, 1, 1, 0, 1, 1, 1]],
  [16, [1, 0]],
  [18, [1, 0]],
  [20, [1, 2]],
  [22, [1, 0]],
  [24, [1, 1]],
  [26, [1, 2]],
]);

export function getPublishedQuizAnswers(language, day) {
  if (language !== 'arabic') return [];
  return ARABIC_QUIZ_ANSWERS.get(Number(day)) ?? [];
}
