import { createHash } from "node:crypto";
import { validPublishedQuiz } from "../utils/publishedContent.js";
export function quizContentKey(questions) {
  return createHash("sha256")
    .update(
      JSON.stringify(
        questions.map((q) => ({
          question: q.question,
          options: [...q.options],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || "",
        })),
      ),
    )
    .digest("hex");
}
export function validReviewedQuiz(quiz) {
  return validPublishedQuiz(quiz) && quiz.length > 0;
}
// Only the latest verified complete attempt for each unchanged, accessible lesson counts.
export function deriveReviewItems(quizzes, lessons, reviews) {
  const latest = new Map();
  for (const q of quizzes) {
    if (!latest.has(q.day)) latest.set(q.day, q);
  }
  const result = [];
  for (const lesson of lessons) {
    const q = latest.get(lesson.day);
    if (
      !q ||
      !validReviewedQuiz(lesson.quiz) ||
      q.contentKey !== quizContentKey(lesson.quiz) ||
      !Array.isArray(q.responses) ||
      q.responses.length !== lesson.quiz.length ||
      q.responses.some(
        (r, index) =>
          !r ||
          r.questionIndex !== index ||
          !Number.isInteger(r.selectedAnswer) ||
          r.selectedAnswer < 0 ||
          r.selectedAnswer >= lesson.quiz[index].options.length ||
          r.isCorrect !==
            (r.selectedAnswer === lesson.quiz[index].correctAnswer),
      )
    )
      continue;
    for (const r of q.responses) {
      if (r.isCorrect !== false) continue;
      const question = lesson.quiz[r.questionIndex];
      if (!question) continue;
      const attempts = reviews.filter(
        (a) =>
          String(a.sourceQuiz) === String(q._id) &&
          a.questionIndex === r.questionIndex &&
          Number.isInteger(a.selectedAnswer) &&
          a.selectedAnswer >= 0 &&
          a.selectedAnswer < question.options.length &&
          a.isCorrect === (a.selectedAnswer === question.correctAnswer),
      );
      const resolved = attempts.some((a) => a.isCorrect === true);
      const last = attempts[0];
      result.push({
        sourceQuiz: String(q._id),
        questionIndex: r.questionIndex,
        day: lesson.day,
        title: lesson.title,
        prompt: question.question,
        options: question.options,
        previousAnswer: r.selectedAnswer,
        explanation: question.explanation || "",
        resolved,
        lastResult: last
          ? {
              confirmed: true,
              reviewComplete: resolved,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation || "",
              isCorrect: last.isCorrect,
              selectedAnswer: last.selectedAnswer,
              completedAt: last.completedAt,
            }
          : null,
      });
    }
  }
  return result;
}
export function recommendLearning({ items, nextLesson, completedDays }) {
  const pending = items.filter((i) => !i.resolved);
  const actions = [];
  if (pending.length)
    actions.push({
      kind: "review",
      title: `Review ${pending.length} saved ${pending.length === 1 ? "mistake" : "mistakes"}`,
      reason: "Your latest server-checked answers need another try.",
    });
  if (nextLesson)
    actions.push({
      kind: "lesson",
      day: nextLesson.day,
      title: nextLesson.title,
      reason: completedDays.includes(nextLesson.day)
        ? "This available lesson is complete; you can revisit it."
        : "This published lesson is available in your enrolled course.",
    });
  return actions.slice(0, 2);
}
