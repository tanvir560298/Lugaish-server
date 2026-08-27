import express from 'express';
import { User } from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { getArabicCourseDay, getEnglishCourseDay } from '../utils/courseLaunch.js';
import { getLearnerProgressState } from '../services/courseProgression.js';

const router = express.Router();

function isEnrolled(user, language) {
  const pathways = Array.isArray(user.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

// Get user progress
router.get('/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const user = await User.findById(req.userId);

    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const calendarDay = language === 'arabic' ? getArabicCourseDay(user) : getEnglishCourseDay(user);
    const learnerProgress = await getLearnerProgressState(user, language, calendarDay);

    res.json({
      totalXP: user.totalXP,
      streak: user.streak,
      completedDays: learnerProgress.completedDays,
      currentDay: learnerProgress.currentDay,
      nextUnlockAt: learnerProgress.nextUnlockAt,
      badges: user.badges,
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update progress after completing a lesson
router.post('/update', authMiddleware, (req, res) => {
  res.status(410).json({ error: 'Complete the assigned PDF lesson or quiz to update course progress.' });
});

export default router;
