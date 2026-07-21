import express from 'express';
import { Quiz } from '../models/Quiz.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { getDaySchedule } from '../utils/courseSchedule.js';
import { getLanguageProgressState } from '../utils/dayProgress.js';
import { isDayModulePublished } from '../utils/speakingPractice.js';

const router = express.Router();

function isEnrolled(user, language) {
  const pathways = Array.isArray(user.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

// Submit quiz
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { day, language, responses } = req.body;
    const normalizedDay = Number(day);
    if (!['english', 'arabic'].includes(language) || !Number.isSafeInteger(normalizedDay) || normalizedDay < 1) {
      return res.status(400).json({ error: 'language and a positive day are required' });
    }
    if (!Array.isArray(responses)) {
      return res.status(400).json({ error: 'responses must be an array' });
    }

    const user = await User.findById(req.userId);

    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const daySchedule = getDaySchedule(normalizedDay);
    if (!daySchedule.isReleased) {
      return res.status(403).json({
        error: daySchedule.courseStarted
          ? `This day is available from ${daySchedule.scheduledFor}.`
          : `The course begins on ${daySchedule.courseStartDate}.`,
        code: daySchedule.courseStarted ? 'DAY_NOT_RELEASED' : 'COURSE_NOT_STARTED',
        daySchedule,
      });
    }

    // Get lesson to verify answers
    const [lesson, progressState] = await Promise.all([
      Lesson.findOne({ language, day: normalizedDay }),
      getLanguageProgressState(user, language),
    ]);
    if (!lesson || !isDayModulePublished(lesson)) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    if (normalizedDay > progressState.currentDay) {
      return res.status(403).json({ error: 'This day is not available yet' });
    }

    // Calculate score
    let correctCount = 0;
    responses.forEach((response, idx) => {
      if (lesson.quiz[idx] && lesson.quiz[idx].correctAnswer === response.selectedAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / lesson.quiz.length) * 100);

    // Save quiz result
    const quiz = new Quiz({
      userId: req.userId,
      day: normalizedDay,
      language,
      responses: responses.map((r, idx) => ({
        questionIndex: idx,
        selectedAnswer: r.selectedAnswer,
        isCorrect: lesson.quiz[idx].correctAnswer === r.selectedAnswer,
      })),
      score,
      totalQuestions: lesson.quiz.length,
    });

    await quiz.save();

    res.json({
      message: 'Quiz submitted',
      score,
      correctAnswers: correctCount,
      totalQuestions: lesson.quiz.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
