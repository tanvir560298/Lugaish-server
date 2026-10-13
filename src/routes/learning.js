import express from "express";
import mongoose from "mongoose";
import { objectBody } from "../middleware/requestShape.js";
import { authMiddleware } from "../middleware/auth.js";
import { createRateLimit } from "../middleware/rateLimit.js";
import { Course } from "../models/Course.js";
import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";
import { Quiz } from "../models/Quiz.js";
import { ReviewAttempt } from "../models/ReviewAttempt.js";
import {
  getArabicCourseDay,
  getEnglishCourseDay,
} from "../utils/courseLaunch.js";
import { getLearnerProgressState } from "../services/courseProgression.js";
import {
  deriveReviewItems,
  recommendLearning,
  validReviewedQuiz,
} from "../services/personalizedLearning.js";
const router = express.Router();
router.use(authMiddleware);
router.use(objectBody);
// These endpoints always enforce student access, including for staff accounts.
async function context(req, res, next) {
  try {
    const language = req.params.language;
    if (!["english", "arabic"].includes(language))
      return res.status(400).json({ error: "Choose Arabic or English." });
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: "Account unavailable." });
    if (!user.enrolledPathways.includes(language))
      return res.status(403).json({ error: "Not enrolled in this language." });
    const course = await Course.findOne({
      language,
      status: "published",
    }).lean();
    if (!course)
      return res.status(404).json({
        error: "No published course is available yet.",
        code: "COURSE_UNAVAILABLE",
      });
    if (course.startAt && new Date(course.startAt) > new Date()) {
      return res.status(403).json({
        error: "This course has not started yet.",
        code: "COURSE_NOT_STARTED",
      });
    }
    const calendar =
      language === "arabic"
        ? getArabicCourseDay({
            role: "learner",
            activeCourseStartDate: course.startAt,
          })
        : getEnglishCourseDay({
            role: "learner",
            activeCourseStartDate: course.startAt,
          });
    const progress = await getLearnerProgressState(user, language, calendar);
    const lessons = await Lesson.find({
      language,
      courseGeneration: course.generation,
      publicationStatus: "published",
      day: { $lte: Math.min(calendar, progress.currentDay) },
      ...(user.isPremium ? {} : { accessTier: { $ne: "premium" } }),
    })
      .sort({ day: 1 })
      .limit(365)
      .lean();
    const [quizzes, reviews] = await Promise.all([
      Quiz.find({
        userId: req.userId,
        language,
        courseGeneration: course.generation,
      })
        .sort({ createdAt: -1, _id: -1 })
        .limit(5001)
        .lean(),
      ReviewAttempt.find({
        userId: req.userId,
        language,
        courseGeneration: course.generation,
      })
        .sort({ createdAt: -1, _id: -1 })
        .limit(5001)
        .lean(),
    ]);
    // Refuse to invent complete recommendations from a truncated history.
    // Pagination/aggregation for larger histories is a separate supported flow.
    if (quizzes.length > 5000 || reviews.length > 5000) {
      return res.status(409).json({
        error:
          "Your learning history exceeds this review view. Contact support for an extended review.",
        code: "REVIEW_HISTORY_LIMIT",
      });
    }
    req.learning = {
      language,
      course,
      progress,
      lessons,
      quizzes,
      reviews,
      items: deriveReviewItems(quizzes, lessons, reviews),
    };
    next();
  } catch {
    res.status(503).json({
      error: "Your saved learning could not be loaded. Please retry.",
    });
  }
}
router.get("/:language", context, (req, res) => {
  const { language, progress, lessons, items } = req.learning;
  const nextLesson = lessons.find((l) => l.day === progress.currentDay) || null;
  res.json({
    language,
    items,
    actions: recommendLearning({
      items,
      nextLesson,
      completedDays: progress.completedDays,
    }),
    completedDays: progress.completedDays,
    nextUnlockAt: progress.nextUnlockAt,
    aiHelpAvailable: false,
  });
});
router.post(
  "/:language/retry",
  createRateLimit({ windowMs: 60000, max: 30, key: (req) => req.userId }),
  context,
  async (req, res) => {
    try {
      const { sourceQuiz, questionIndex, selectedAnswer, requestId } = req.body;
      if (
        typeof sourceQuiz !== "string" ||
        !/^[a-fA-F0-9]{24}$/.test(sourceQuiz) ||
        !mongoose.isValidObjectId(sourceQuiz) ||
        !Number.isInteger(questionIndex) ||
        !Number.isInteger(selectedAnswer) ||
        typeof requestId !== "string" ||
        !/^[a-zA-Z0-9-]{8,80}$/.test(requestId)
      )
        return res.status(400).json({
          error:
            "A valid saved question, answer and retry identifier are required.",
        });
      const c = req.learning,
        quiz = c.quizzes.find((q) => String(q._id) === sourceQuiz),
        item = c.items.find(
          (i) =>
            i.sourceQuiz === sourceQuiz && i.questionIndex === questionIndex,
        );
      if (!quiz || !item)
        return res.status(404).json({
          error:
            "This saved mistake is unavailable or its lesson changed. Open the current activity.",
        });
      const question = c.lessons.find((l) => l.day === quiz.day)?.quiz[
        questionIndex
      ];
      if (
        !question ||
        !validReviewedQuiz([question]) ||
        selectedAnswer < 0 ||
        selectedAnswer >= question.options.length
      )
        return res.status(400).json({ error: "Choose a supplied answer." });
      let saved = await ReviewAttempt.findOne({
        userId: req.userId,
        requestId,
      });
      if (
        saved &&
        (String(saved.sourceQuiz) !== sourceQuiz ||
          saved.questionIndex !== questionIndex ||
          saved.selectedAnswer !== selectedAnswer)
      )
        return res.status(409).json({
          error:
            "This retry identifier was already used for a different answer.",
        });
      if (!saved) {
        try {
          saved = await ReviewAttempt.create({
            userId: req.userId,
            sourceQuiz,
            questionIndex,
            selectedAnswer,
            requestId,
            language: c.language,
            courseGeneration: c.course.generation,
            isCorrect: selectedAnswer === question.correctAnswer,
          });
        } catch (e) {
          if (e.code !== 11000) throw e;
          saved = await ReviewAttempt.findOne({
            userId: req.userId,
            requestId,
          });
          if (
            String(saved.sourceQuiz) !== sourceQuiz ||
            saved.questionIndex !== questionIndex ||
            saved.selectedAnswer !== selectedAnswer
          )
            return res
              .status(409)
              .json({ error: "Retry identifier conflict." });
        }
      }
      res.json({
        confirmed: true,
        isCorrect: saved.isCorrect,
        selectedAnswer: saved.selectedAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || "",
        completedAt: saved.completedAt,
        reviewComplete: item.resolved || saved.isCorrect,
        xpAwarded: 0,
      });
    } catch {
      res.status(503).json({
        error: "Your retry could not be saved. Retry with the same answer.",
      });
    }
  },
);
export default router;
