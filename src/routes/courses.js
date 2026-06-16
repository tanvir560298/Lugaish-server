import express from 'express';
import { Lesson } from '../models/Lesson.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all courses/languages
router.get('/', async (req, res) => {
  try {
    const englishCount = await Lesson.countDocuments({ language: 'english' });
    const arabicCount = await Lesson.countDocuments({ language: 'arabic' });

    res.json([
      {
        id: 'english',
        name: 'English',
        description: 'Master English communication',
        lessons: englishCount,
        difficulty: 'Beginner to Advanced',
      },
      {
        id: 'arabic',
        name: 'Arabic',
        description: 'Learn Arabic fluently',
        lessons: arabicCount,
        difficulty: 'Beginner to Advanced',
      },
    ]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get course by language
router.get('/:language', async (req, res) => {
  try {
    const { language } = req.params;

    if (!['english', 'arabic'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const lessons = await Lesson.find({ language }).select('day title description duration');

    res.json({
      language,
      totalDays: lessons.length,
      lessons,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
