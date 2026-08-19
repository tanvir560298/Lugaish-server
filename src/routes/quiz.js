import express from 'express';
import { Quiz } from '../models/Quiz.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { getArabicCourseDay } from '../utils/courseLaunch.js';

const router = express.Router();

function isEnrolled(user, language) {
  const pathways = Array.isArray(user.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

// Submit quiz
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { day, language, responses } = req.body;
    if (!['english', 'arabic'].includes(language) || !Number.isSafeInteger(Number(day)) || !Array.isArray(responses)) {
      return res.status(400).json({ error: 'A valid language, day, and response list are required' });
    }

    const [user, lesson] = await Promise.all([
      User.findById(req.userId),
      Lesson.findOne({ language, day }),
    ]);

    if (!user) return res.status(401).json({ error: 'User not found' });

    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    if (language === 'arabic') {
      const courseDay = await getArabicCourseDay(user);
      if (day > courseDay) {
        return res.status(403).json({ error: 'This quiz is not unlocked yet.' });
      }
    }

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    if (!Array.isArray(lesson.quiz) || lesson.quiz.length === 0) {
      return res.status(409).json({ error: 'This lesson does not have a quiz yet' });
    }
    if (responses.length !== lesson.quiz.length || responses.some(response => !Number.isSafeInteger(response?.selectedAnswer))) {
      return res.status(400).json({ error: 'Submit one valid answer for every quiz question' });
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
      day,
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
