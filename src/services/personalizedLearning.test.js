import test from "node:test";
import assert from "node:assert/strict";
import {
  quizContentKey,
  deriveReviewItems,
  recommendLearning,
  validReviewedQuiz,
} from "./personalizedLearning.js";
const questions = [
  {
    question: "Greeting?",
    options: ["Hello", "Bye"],
    correctAnswer: 0,
    explanation: "Hello welcomes someone.",
  },
];
const lesson = { day: 1, title: "Greeting", quiz: questions };
const quiz = {
  _id: "saved",
  day: 1,
  contentKey: quizContentKey(questions),
  responses: [{ questionIndex: 0, selectedAnswer: 1, isCorrect: false }],
};
test("only latest verified wrong answers from unchanged accessible content become review", () => {
  assert.equal(deriveReviewItems([quiz], [lesson], []).length, 1);
  assert.equal(
    deriveReviewItems([{ ...quiz, contentKey: undefined }], [lesson], [])
      .length,
    0,
  );
  assert.equal(
    deriveReviewItems(
      [quiz],
      [{ ...lesson, quiz: [{ ...questions[0], question: "Edited" }] }],
      [],
    ).length,
    0,
  );
  assert.equal(deriveReviewItems([quiz], [], []).length, 0);
  assert.equal(
    deriveReviewItems(
      [{ ...quiz, responses: [{ questionIndex: 0, isCorrect: true }] }, quiz],
      [lesson],
      [],
    ).length,
    0,
  );
});
test("verified correct retry resolves review, wrong retry remains and recommendation explains evidence", () => {
  const wrong = {
    sourceQuiz: "saved",
    questionIndex: 0,
    selectedAnswer: 1,
    isCorrect: false,
  };
  let items = deriveReviewItems([quiz], [lesson], [wrong]);
  assert.equal(items[0].resolved, false);
  assert.equal(
    recommendLearning({ items, nextLesson: null, completedDays: [] })[0].kind,
    "review",
  );
  items = deriveReviewItems(
    [quiz],
    [lesson],
    [{ ...wrong, selectedAnswer: 0, isCorrect: true }, wrong],
  );
  assert.equal(items[0].resolved, true);
  assert.deepEqual(
    recommendLearning({ items, nextLesson: null, completedDays: [] }),
    [],
  );
  assert.equal(
    recommendLearning({
      items,
      nextLesson: lesson,
      completedDays: [1],
    })[0].reason.includes("complete"),
    true,
  );
});
test("review rejects malformed answer keys and preserves Arabic distinctions", () => {
  assert.equal(validReviewedQuiz([null]), false);
  assert.equal(
    deriveReviewItems([{ ...quiz, responses: null }], [lesson], []).length,
    0,
  );
  assert.equal(
    deriveReviewItems(
      [
        {
          ...quiz,
          responses: [
            { questionIndex: 0, selectedAnswer: 0, isCorrect: false },
          ],
        },
      ],
      [lesson],
      [],
    ).length,
    0,
  );
  assert.equal(
    deriveReviewItems(
      [quiz],
      [lesson],
      [
        {
          sourceQuiz: "saved",
          questionIndex: 0,
          selectedAnswer: 1,
          isCorrect: true,
        },
      ],
    )[0].resolved,
    false,
  );
  assert.equal(
    validReviewedQuiz([{ ...questions[0], correctAnswer: 2 }]),
    false,
  );
  assert.equal(
    validReviewedQuiz([{ ...questions[0], options: ["Only"] }]),
    false,
  );
  assert.notEqual(
    quizContentKey([{ ...questions[0], question: "عَلَم" }]),
    quizContentKey([{ ...questions[0], question: "علم" }]),
  );
});
