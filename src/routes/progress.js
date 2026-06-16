import express from 'express';
import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user progress
router.get('/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const user = await User.findById(req.userId);

    if (user.languageSelected !== language) {
      return res.status(403).json({ error: 'Language mismatch' });
    }

    let progress = await Progress.findOne({ userId: req.userId, language });
    if (!progress) {
      progress = new Progress({ userId: req.userId, language });
      await progress.save();
    }

    res.json({
      totalXP: user.totalXP,
      streak: user.streak,
      completedDays: user.completedLessons,
      currentDay: user.currentDay,
      badges: user.badges,
      lastActiveDate: user.lastActiveDate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update progress after completing a lesson
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { language, day, score } = req.body;
    const user = await User.findById(req.userId);

    if (user.languageSelected !== language) {
      return res.status(403).json({ error: 'Language mismatch' });
    }

    let progress = await Progress.findOne({ userId: req.userId, language });
    if (!progress) {
      progress = new Progress({ userId: req.userId, language });
    }

    // Update completed days
    const completedDay = progress.completedDays.find(d => d.day === day);
    if (!completedDay) {
      progress.completedDays.push({
        day,
        completedAt: new Date(),
        score: score || 0,
      });
    }

    progress.totalXP += 100;
    progress.lastActiveDate = new Date();

    // Update streak
    const today = new Date();
    const lastActive = new Date(user.lastActiveDate);
    const dayDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      user.streak += 1;
      progress.streak += 1;
    } else if (dayDiff > 1) {
      user.streak = 1;
      progress.streak = 1;
    }

    user.lastActiveDate = today;
    await user.save();
    await progress.save();

    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
