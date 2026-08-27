import express from 'express';
import { Quiz } from '../models/Quiz.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { authMiddleware } from '../middleware/auth.js';
import { getArabicCourseDay, getEnglishCourseDay } from '../utils/courseLaunch.js';
import { getPublishedQuizAnswers } from '../data/publishedQuizAnswers.js';
import { ROLES, normalizeRole } from '../utils/roles.js';
import { createRateLimit } from '../middleware/rateLimit.js';
import { getLearnerProgressState, getNextDhakaMidnight } from '../services/courseProgression.js';

const router = express.Router();
const quizSubmissionLimit = createRateLimit({
  windowMs: 60 * 1000,
  max: 30,
  key: req => req.userId,
});

function isEnrolled(user, language) {
  const pathways = Array.isArray(user.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

// Submit quiz
router.post('/submit', authMiddleware, quizSubmissionLimit, async (req, res) => {
  try {
    const { day, language, responses } = req.body;
    if (!['english', 'arabic'].includes(language) || !Number.isSafeInteger(Number(day)) || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'A valid language, day, and response list are required' });
    }

    const [user, lesson, previousSubmission] = await Promise.all([
      User.findById(req.userId),
      Lesson.findOne({ language, day }),
      Quiz.exists({ userId: req.userId, language, day: Number(day) }),
    ]);

    if (!user) return res.status(401).json({ error: 'User not found' });

    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const learnerPreview = normalizeRole(user.role) === ROLES.webDeveloper
      && req.get('X-Lugaish-Learner-Preview') === '1';
    const scheduleUser = learnerPreview ? { ...user.toObject(), role: ROLES.learner } : user;
    const effectiveRole = learnerPreview ? ROLES.learner : normalizeRole(user.role);
    let courseDay = 365;
    if (language === 'arabic') {
      courseDay = await getArabicCourseDay(scheduleUser);
    } else if (language === 'english') {
      courseDay = await getEnglishCourseDay(scheduleUser);
    }

    const previouslyCompleted = Boolean(previousSubmission)
      || (user.completionRewards ?? []).includes(`${language}:${Number(day)}`);
    const learnerProgress = effectiveRole === ROLES.learner
      ? await getLearnerProgressState(user, language, courseDay)
      : null;
    if (effectiveRole === ROLES.learner && Number(day) !== learnerProgress.currentDay && !previouslyCompleted) {
      return res.status(403).json({ error: `Complete Day ${learnerProgress.currentDay} first.` });
    }
    if (Number(day) > courseDay) {
      return res.status(403).json({ error: 'This quiz is not unlocked yet.' });
    }
    if (effectiveRole === ROLES.learner && ['arabic', 'english'].includes(language) && Number(day) % 2 !== 0) {
      return res.status(409).json({ error: 'Mark this PDF day complete from the lesson page.' });
    }

    const storedAnswers = Array.isArray(lesson?.quiz)
      ? lesson.quiz.map(question => question.correctAnswer)
      : [];
    const answerKey = storedAnswers.length
      ? storedAnswers
      : getPublishedQuizAnswers(language, day);
    if (answerKey.length === 0) {
      return res.status(409).json({ error: 'This lesson does not have a quiz yet' });
    }
    if (responses.length !== answerKey.length || responses.some(response => (
      !Number.isSafeInteger(response?.selectedAnswer)
      || response.selectedAnswer < 0
      || response.selectedAnswer > 3
    ))) {
      return res.status(400).json({ error: 'Submit one valid answer for every quiz question' });
    }

    // Calculate score
    let correctCount = 0;
    responses.forEach((response, idx) => {
      if (answerKey[idx] === response.selectedAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / answerKey.length) * 100);

    // Save quiz result
    const quiz = new Quiz({
      userId: req.userId,
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

    const rewardKey = `${language}:${Number(day)}`;
    const rewardedUser = previousSubmission ? null : await User.findOneAndUpdate(
      { _id: req.userId, completionRewards: { $ne: rewardKey } },
      {
        $addToSet: { completionRewards: rewardKey, completedLessons: Number(day) },
        $inc: { totalXP: 500 },
        $set: { lastActiveDate: new Date() },
      },
      { new: true },
    );
    const xpAwarded = rewardedUser ? 500 : 0;

    await quiz.save();
    if (xpAwarded) {
      await Progress.findOneAndUpdate(
        { userId: req.userId, language },
        {
          $push: { completedDays: { day: Number(day), completedAt: new Date(), score } },
          $inc: { totalXP: xpAwarded },
          $set: { lastActiveDate: new Date(), currentDay: Number(day), nextUnlockAt: getNextDhakaMidnight() },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    res.json({
      message: 'Quiz submitted',
      score,
      correctAnswers: correctCount,
      totalQuestions: answerKey.length,
      xpAwarded,
      totalXP: rewardedUser?.totalXP ?? user.totalXP,
      streak: rewardedUser?.streak ?? user.streak,
      alreadyCompleted: xpAwarded === 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
