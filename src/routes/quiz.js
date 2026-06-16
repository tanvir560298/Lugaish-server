import express from 'express';
import { Quiz } from '../models/Quiz.js';
import { Lesson } from '../models/Lesson.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Submit quiz
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { day, language, responses } = req.body;

    // Get lesson to verify answers
    const lesson = await Lesson.findOne({ language, day });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
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
