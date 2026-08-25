import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSE_DATA } from '../../../src/data/courseData.js';
import { getPublishedQuizAnswers } from './publishedQuizAnswers.js';

for (const language of ['arabic', 'english']) {
  test(`${language} bundled quizzes have matching server answer keys`, () => {
    const lessons = COURSE_DATA[language].modules.flatMap(module => module.lessons);

    lessons.forEach((lesson, index) => {
      if (!lesson.quiz?.length) return;
      const day = index + 1;
      assert.deepEqual(
        getPublishedQuizAnswers(language, day),
        lesson.quiz.map(question => question.answer),
        `${language} Day ${day} answer key is out of sync`,
      );
    });
  });
}
