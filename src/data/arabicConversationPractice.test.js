import assert from 'node:assert/strict';
import test from 'node:test';
import { ARABIC_CONVERSATION_DAYS } from './arabicConversationPractice.js';
import { normalizeSpeakingQuestions } from '../utils/speakingPractice.js';

test('Arabic conversation curriculum contains respond and ask days', () => {
  assert.deepEqual(ARABIC_CONVERSATION_DAYS.map(item => item.day), [2, 3]);
  assert.deepEqual(ARABIC_CONVERSATION_DAYS.map(item => item.speakingPracticeMode), ['respond', 'ask']);
});

test('both conversation days contain five valid ten-mark questions', () => {
  for (const day of ARABIC_CONVERSATION_DAYS) {
    const questions = normalizeSpeakingQuestions(day.speakingQuestions, 'arabic');
    assert.equal(questions.length, 5);
    assert.equal(questions.reduce((total, question) => total + question.maxMarks, 0), 50);
    assert.ok(questions.every(question => question.acceptedResponses.length > 0));
  }
});

test('Day 3 provides an Arabic AI response for every student question', () => {
  const dayThree = ARABIC_CONVERSATION_DAYS.find(item => item.day === 3);
  assert.ok(dayThree.speakingQuestions.every(question => question.aiResponse));
  assert.ok(dayThree.speakingQuestions.every(question => question.scoringStrategy === 'question_reading'));
});
