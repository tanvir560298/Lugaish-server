import assert from 'node:assert/strict';
import test from 'node:test';
import { ARABIC_CONVERSATION_DAYS, CONVERSATION_DAYS } from './arabicConversationPractice.js';
import { normalizeSpeakingQuestions } from '../utils/speakingPractice.js';

test('Arabic conversation curriculum contains respond and ask days', () => {
  assert.deepEqual(ARABIC_CONVERSATION_DAYS.map(item => item.day), [2, 3]);
  assert.deepEqual(ARABIC_CONVERSATION_DAYS.map(item => item.speakingPracticeMode), ['respond', 'ask']);
});

test('English and Arabic both follow video, respond, then ask order', () => {
  for (const language of ['english', 'arabic']) {
    const days = CONVERSATION_DAYS.filter(item => item.language === language);
    assert.deepEqual(days.map(item => item.day), [2, 3]);
    assert.deepEqual(days.map(item => item.speakingPracticeMode), ['respond', 'ask']);
  }
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

test('every Day 3 is versioned as ask mode with learner instructions', () => {
  const askDays = CONVERSATION_DAYS.filter(item => item.day === 3);
  assert.equal(askDays.length, 2);
  assert.ok(askDays.every(item => item.speakingPracticeMode === 'ask'));
  assert.ok(askDays.every(item => item.managedContentKey));
  assert.ok(askDays.every(item => item.moduleIntroTitle && item.moduleIntroText));
});

test('English Day 2 is guided by Rafi while Day 3 retains the Rafi and Sami role play', () => {
  const englishDays = CONVERSATION_DAYS.filter(item => item.language === 'english');
  const [respondDay, askDay] = englishDays;

  assert.equal(respondDay.speakingQuestions.length, 7);
  assert.equal(askDay.speakingQuestions.length, 7);
  assert.match(respondDay.moduleIntroTitle, /Rafi/i);
  assert.match(askDay.moduleIntroTitle, /Rafi/i);
  assert.equal(respondDay.speakingQuestions[0].question, "Hi! I'm Rafi. Nice to meet you. What is your name?");
  assert.equal(respondDay.speakingQuestions[0].scoringStrategy, 'english_first_meeting');
  assert.ok(askDay.speakingQuestions.every(question => question.scoringStrategy === 'question_reading'));
  assert.equal(askDay.speakingQuestions[0].question, 'Hi! My name is Rafi. What’s your name?');
});
