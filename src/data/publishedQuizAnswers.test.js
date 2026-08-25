import test from 'node:test';
import assert from 'node:assert/strict';
import { getPublishedQuizAnswers } from './publishedQuizAnswers.js';

for (const language of ['arabic', 'english']) {
  test(`${language} has a server answer key for every scheduled quiz day`, () => {
    for (let day = 1; day <= 30; day += 1) {
      const answerKey = getPublishedQuizAnswers(language, day);
      if (day % 2 === 0) {
        assert.ok(answerKey.length > 0, `${language} Day ${day} is missing an answer key`);
        assert.ok(answerKey.every(answer => Number.isSafeInteger(answer) && answer >= 0 && answer <= 3));
      } else {
        assert.deepEqual(answerKey, []);
      }
    }
  });
}
