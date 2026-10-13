import { coursePublication } from "../middleware/coursePublication.js";
import express from "express";
import { objectBody } from "../middleware/requestShape.js";
import { Quiz } from "../models/Quiz.js";
import { Lesson } from "../models/Lesson.js";
import { User } from "../models/User.js";
import { Progress } from "../models/Progress.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  getArabicCourseDay,
  getEnglishCourseDay,
} from "../utils/courseLaunch.js";
import { ROLES, normalizeRole } from "../utils/roles.js";
import { createRateLimit } from "../middleware/rateLimit.js";
import {
  getLearnerProgressState,
  getNextDhakaMidnight,
} from "../services/courseProgression.js";

import {
  quizContentKey,
  validReviewedQuiz,
} from "../services/personalizedLearning.js";
import {
  validQuizResponses,
  serializeQuizResult,
} from "../services/quizResult.js";

const router = express.Router();
router.use(objectBody);
router.use(coursePublication);
const quizSubmissionLimit = createRateLimit({
  windowMs: 60 * 1000,
  max: 30,
  key: (req) => req.userId,
});

function isEnrolled(user, language) {
  const pathways = Array.isArray(user.enrolledPathways)
    ? user.enrolledPathways
    : [];
  return pathways.includes(language);
}

// Read permission independently of browser state and bundled answer data.
router.get("/access/:language/:day", authMiddleware, async (req, res) => {
  try {
    const language = req.params.language,
      day = Number(req.params.day);
    if (
      !["english", "arabic"].includes(language) ||
      !Number.isInteger(day) ||
      day < 1 ||
      day > 365
    )
      return res.status(400).json({ error: "Invalid quiz language or day" });
    const [user, lesson] = await Promise.all([
      User.findById(req.userId),
      Lesson.findOne({ language, day, ...req.publicationFilter }),
    ]);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!isEnrolled(user, language))
      return res.status(403).json({ error: "Not enrolled in this language" });
    const preview =
      normalizeRole(user.role) === ROLES.webDeveloper &&
      req.get("X-Lugaish-Learner-Preview") === "1";
    const role = preview ? ROLES.learner : normalizeRole(user.role),
      scheduleUser = preview
        ? { ...user.toObject(), role: ROLES.learner }
        : user;
    if (role === ROLES.learner) {
      if (lesson?.accessTier === "premium" && !user.isPremium)
        return res.status(403).json({
          error: "This premium lesson is not included in your current plan",
        });
      const calendar =
        language === "arabic"
          ? await getArabicCourseDay({
              role: scheduleUser.role,
              activeCourseStartDate: req.publishedCourse?.startAt,
            })
          : await getEnglishCourseDay({
              role: scheduleUser.role,
              activeCourseStartDate: req.publishedCourse?.startAt,
            });
      const progress = await getLearnerProgressState(user, language, calendar);
      if (day > calendar || day > progress.currentDay)
        return res
          .status(403)
          .json({ error: "This lesson is not unlocked yet" });
    }
    if (!lesson?.quiz?.length)
      return res
        .status(409)
        .json({ error: "No quiz is published for this lesson" });
    return res.json({ allowed: true, language, day });
  } catch (error) {
    return res
      .status(503)
      .json({ error: "This request could not be completed. Please retry." });
  }
});

// Owner-scoped saved results; never accepts a client-authored completion receipt.
router.get("/result/:language/:day", authMiddleware, async (req, res) => {
  try {
    const language = req.params.language,
      day = Number(req.params.day);
    if (
      !["english", "arabic"].includes(language) ||
      !Number.isInteger(day) ||
      day < 1 ||
      day > 365
    )
      return res.status(400).json({ error: "Invalid quiz language or day" });
    const [user, lesson] = await Promise.all([
      User.findById(req.userId),
      Lesson.findOne({ language, day, ...req.publicationFilter }),
    ]);
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!isEnrolled(user, language))
      return res.status(403).json({ error: "Not enrolled in this language" });
    const learnerView =
      normalizeRole(user.role) === ROLES.learner ||
      (normalizeRole(user.role) === ROLES.webDeveloper &&
        req.get("X-Lugaish-Learner-Preview") === "1");
    if (lesson?.accessTier === "premium" && !user.isPremium && learnerView)
      return res.status(403).json({
        error: "This premium lesson is not included in your current plan",
      });
    const quiz = await Quiz.findOne({
      userId: req.userId,
      language,
      day,
      courseGeneration: req.courseGeneration,
    }).sort({ createdAt: -1 });
    if (!quiz)
      return res
        .status(404)
        .json({ error: "No saved quiz result for this lesson" });
    return res.json({
      ...serializeQuizResult(quiz),
      ...(validReviewedQuiz(lesson?.quiz) &&
      quiz.contentKey === quizContentKey(lesson.quiz)
        ? {
            feedback: lesson.quiz.map((q, i) => ({
              questionIndex: i,
              isCorrect: quiz.responses[i]?.isCorrect === true,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation || "",
            })),
          }
        : {}),
    });
  } catch (error) {
    return res
      .status(503)
      .json({ error: "This request could not be completed. Please retry." });
  }
});

// Submit quiz
router.post(
  "/submit",
  authMiddleware,
  quizSubmissionLimit,
  async (req, res) => {
    try {
      const { day, language, responses, requestId } = req.body;
      if (
        !["english", "arabic"].includes(language) ||
        !["number", "string"].includes(typeof day) ||
        !Number.isSafeInteger(Number(day)) ||
        Number(day) < 1 ||
        Number(day) > 365 ||
        !Array.isArray(responses) ||
        (requestId !== undefined &&
          (typeof requestId !== "string" ||
            !/^[a-zA-Z0-9-]{8,80}$/.test(requestId)))
      ) {
        return res.status(400).json({
          error: "A valid language, day, and response list are required",
        });
      }

      const [user, lesson, previousSubmission] = await Promise.all([
        User.findById(req.userId),
        Lesson.findOne({ language, day, ...req.publicationFilter }),
        Quiz.exists({
          userId: req.userId,
          language,
          day: Number(day),
          courseGeneration: req.courseGeneration,
        }),
      ]);

      if (!user) return res.status(401).json({ error: "User not found" });

      if (!isEnrolled(user, language)) {
        return res.status(403).json({ error: "Not enrolled in this language" });
      }

      const learnerPreview =
        normalizeRole(user.role) === ROLES.webDeveloper &&
        req.get("X-Lugaish-Learner-Preview") === "1";
      const scheduleUser = learnerPreview
        ? { ...user.toObject(), role: ROLES.learner }
        : user;
      const effectiveRole = learnerPreview
        ? ROLES.learner
        : normalizeRole(user.role);
      if (
        effectiveRole === ROLES.learner &&
        lesson?.accessTier === "premium" &&
        !user.isPremium
      )
        return res.status(403).json({
          error: "This premium lesson is not included in your current plan",
        });
      let courseDay = 365;
      if (language === "arabic") {
        courseDay = await getArabicCourseDay({
          role: scheduleUser.role,
          activeCourseStartDate: req.publishedCourse?.startAt,
        });
      } else if (language === "english") {
        courseDay = await getEnglishCourseDay({
          role: scheduleUser.role,
          activeCourseStartDate: req.publishedCourse?.startAt,
        });
      }

      const previouslyCompleted =
        Boolean(previousSubmission) ||
        (user.completionRewards ?? []).includes(
          `${req.courseGeneration}:${language}:${Number(day)}`,
        );
      const learnerProgress =
        effectiveRole === ROLES.learner
          ? await getLearnerProgressState(user, language, courseDay)
          : null;
      if (
        effectiveRole === ROLES.learner &&
        Number(day) !== learnerProgress.currentDay &&
        !previouslyCompleted
      ) {
        return res
          .status(403)
          .json({ error: `Complete Day ${learnerProgress.currentDay} first.` });
      }
      if (Number(day) > courseDay) {
        return res
          .status(403)
          .json({ error: "This quiz is not unlocked yet." });
      }
      const storedAnswers = Array.isArray(lesson?.quiz)
        ? lesson.quiz
            .map((question) => question.correctAnswer ?? question.answer)
            .filter(
              (answer) =>
                Number.isInteger(answer) && answer >= 0 && answer <= 3,
            )
        : [];
      const publishedAnswers = []; // Legacy bundled keys are archived, never reused for future courses.
      const answerKey =
        publishedAnswers.length >= storedAnswers.length
          ? publishedAnswers
          : storedAnswers.length
            ? storedAnswers
            : publishedAnswers;

      if (
        !validReviewedQuiz(lesson?.quiz) ||
        answerKey.length !== lesson.quiz.length
      ) {
        return res
          .status(409)
          .json({ error: "This lesson does not have a quiz yet" });
      }
      if (
        !validQuizResponses(responses, answerKey.length) ||
        responses.some(
          (r, i) => r.selectedAnswer >= lesson.quiz[i].options.length,
        )
      ) {
        return res.status(400).json({
          error: "Submit exactly one valid answer for every quiz question",
        });
      }

      // Calculate score
      let correctCount = 0;
      const questionsToScore = Math.min(responses.length, answerKey.length);
      for (let idx = 0; idx < questionsToScore; idx += 1) {
        if (answerKey[idx] === responses[idx].selectedAnswer) {
          correctCount += 1;
        }
      }

      const totalQuestions = Math.max(responses.length, answerKey.length);
      const score =
        totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;

      // Save quiz result
      let quiz = new Quiz({
        userId: req.userId,
        courseGeneration: req.courseGeneration,
        contentKey: quizContentKey(lesson.quiz),
        ...(requestId ? { requestId } : {}),
        completionEligible: !previousSubmission,
        day,
        language,
        responses: responses.map((r, idx) => ({
          questionIndex: idx,
          selectedAnswer: r.selectedAnswer,
          isCorrect: answerKey[idx] === r.selectedAnswer,
        })),
        score,
        totalQuestions: answerKey.length,
      });
      const matchesRequest = (saved) =>
        saved.language === language &&
        saved.day === Number(day) &&
        saved.courseGeneration === req.courseGeneration &&
        saved.contentKey === quizContentKey(lesson.quiz) &&
        saved.responses.length === responses.length &&
        saved.responses.every(
          (r, i) => r.selectedAnswer === responses[i].selectedAnswer,
        );
      if (requestId) {
        const existing = await Quiz.findOne({ userId: req.userId, requestId });
        if (existing && !matchesRequest(existing))
          return res.status(409).json({
            error:
              "This submission identifier was already used for different answers.",
          });
        if (existing) quiz = existing;
        else {
          try {
            await quiz.save();
          } catch (error) {
            if (error.code !== 11000) throw error;
            quiz = await Quiz.findOne({ userId: req.userId, requestId });
            if (!quiz || !matchesRequest(quiz))
              return res
                .status(409)
                .json({ error: "Submission identifier conflict." });
          }
        }
      } else await quiz.save();
      // A verified receipt must exist before awarding completion/XP. The atomic
      // reward key then handles concurrent requests and replayed receipts once.

      const dayNum = Number(day);
      const rewardKey = `${req.courseGeneration}:${language}:${dayNum}`;
      const prevDay = null; // A fresh course never completes another lesson implicitly.
      const prevRewardKey = prevDay
        ? `${req.courseGeneration}:${language}:${prevDay}`
        : null;
      const completionLessonsToAdd = prevDay ? [dayNum, prevDay] : [dayNum];
      const completionRewardsToAdd = prevRewardKey
        ? [rewardKey, prevRewardKey]
        : [rewardKey];

      const rewardedUser = !quiz.completionEligible
        ? null
        : await User.findOneAndUpdate(
            { _id: req.userId, completionRewards: { $ne: rewardKey } },
            {
              $addToSet: {
                completionRewards: { $each: completionRewardsToAdd },
                completedLessons: { $each: completionLessonsToAdd },
              },
              $inc: { totalXP: 500 },
              $set: { lastActiveDate: new Date() },
            },
            { new: true },
          );
      const xpAwarded = rewardedUser ? 500 : 0;
      const resultUser =
        rewardedUser ||
        (await User.findById(req.userId).select("totalXP streak"));

      if (xpAwarded) {
        const daysToPush = [{ day: dayNum, completedAt: new Date(), score }];
        if (prevDay) {
          daysToPush.unshift({ day: prevDay, completedAt: new Date() });
        }
        await Progress.findOneAndUpdate(
          {
            userId: req.userId,
            language,
            courseGeneration: req.courseGeneration,
          },
          {
            $push: { completedDays: { $each: daysToPush } },
            $inc: { totalXP: xpAwarded },
            $set: {
              lastActiveDate: new Date(),
              currentDay: dayNum,
              nextUnlockAt: getNextDhakaMidnight(),
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }

      res.json({
        message: "Quiz submitted",
        confirmed: true,
        feedback: lesson.quiz.map((q, i) => ({
          questionIndex: i,
          isCorrect: answerKey[i] === responses[i].selectedAnswer,
          correctAnswer: answerKey[i],
          explanation: q.explanation || "",
        })),
        completedAt: quiz.completedAt,
        score,
        correctAnswers: correctCount,
        totalQuestions: answerKey.length,
        xpAwarded,
        totalXP: resultUser?.totalXP ?? user.totalXP,
        streak: resultUser?.streak ?? user.streak,
        alreadyCompleted: xpAwarded === 0,
      });
    } catch (error) {
      res
        .status(503)
        .json({ error: "This request could not be completed. Please retry." });
    }
  },
);

export default router;
