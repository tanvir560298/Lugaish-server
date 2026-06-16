import express from 'express';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { Quiz } from '../models/Quiz.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get today's lesson (based on user progress)
router.get('/today/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const user = await User.findById(req.userId);

    if (user.languageSelected !== language) {
      return res.status(403).json({ error: 'Language mismatch' });
    }

    const lesson = await Lesson.findOne({ language, day: user.currentDay });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Remove answers from quiz for security
    const lessonData = lesson.toObject();
    lessonData.quiz = lesson.quiz.map(q => ({
      question: q.question,
      options: q.options,
    }));

    res.json({
      ...lessonData,
      userDay: user.currentDay,
      alreadyCompleted: user.completedLessons.includes(user.currentDay),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get lesson by day and language
router.get('/:language/:day', async (req, res) => {
  try {
    const { language, day } = req.params;

    const lesson = await Lesson.findOne({ language, day: Number(day) });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete lesson
router.post('/complete', authMiddleware, async (req, res) => {
  try {
    const { day, language } = req.body;
    const user = await User.findById(req.userId);

    if (user.languageSelected !== language) {
      return res.status(403).json({ error: 'Language mismatch' });
    }

    if (!user.completedLessons.includes(day)) {
      user.completedLessons.push(day);
      user.totalXP += 100;

      if (day === user.currentDay) {
        user.currentDay += 1;
      }
    }

    await user.save();

    res.json({ message: 'Lesson completed', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
