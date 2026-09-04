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
  [16, [0, 0, 0, 0, 1, 2, 0, 1, 2, 1]],
  [18, [1, 0]],
  [20, [1, 2]],
  [22, [1, 0]],
  [24, [1, 1]],
  [26, [1, 2]],
  [28, [1, 2, 0, 2, 3, 0, 1, 0, 1, 2]],
  [30, [0, 1, 2, 3, 1, 1, 2, 0, 3, 2]],
]);

const ENGLISH_QUIZ_ANSWERS = new Map([
  [2, [1, 2, 1, 0, 1, 2, 0, 2, 1, 3]],
  [4, [1, 2, 0, 2, 1, 2, 1, 1, 1, 2]],
  [6, [1, 1, 1, 2, 1, 1, 1, 2, 1, 2]],
  [8, [1, 1, 1, 2, 1, 1, 1, 2, 1, 0]],
  [10, [1, 2, 1, 1, 1, 1, 0, 1, 2, 0]],
  [12, [1, 0, 1, 2, 2, 0, 1, 1, 0, 2]],
  [14, [1, 1, 1, 1, 2, 1, 2, 1, 2, 1]],
  [16, [1, 1, 2, 1, 2, 1, 0, 1, 1, 2]],
  [18, [1, 2, 1, 2, 1, 2, 2, 1, 2, 2]],
  [20, [1, 0, 1, 1, 1, 1, 1, 0, 1, 2]],
  [22, [2, 1, 0, 2, 1, 1, 2, 1, 2, 0]],
  [24, [1, 2, 0, 0, 1, 0, 1, 1, 1, 1]],
  [26, [1, 1, 1, 0, 2, 0, 0, 2, 1, 0]],
  [28, [0, 1, 1, 1, 1, 1, 1, 1, 0, 1]],
  [30, [0, 0, 1, 1, 1, 2, 1, 1, 1, 0]],
]);

export function getPublishedQuizAnswers(language, day) {
  if (language === 'arabic') {
    return ARABIC_QUIZ_ANSWERS.get(Number(day)) ?? [];
  }
  if (language === 'english') {
    return ENGLISH_QUIZ_ANSWERS.get(Number(day)) ?? [];
  }
  return [];
}
