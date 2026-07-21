import express from 'express';
import { User } from '../models/User.js';
import { Lesson } from '../models/Lesson.js';
import { authMiddleware } from '../middleware/auth.js';
import { getLanguageProgressState, markLanguageDayCompleted } from '../utils/dayProgress.js';
import { getCourseSchedule, getDaySchedule } from '../utils/courseSchedule.js';
import { getDayModuleType, isDayModulePublished } from '../utils/speakingPractice.js';
import { getLessonVideoProgress } from '../utils/videoProgress.js';

const router = express.Router();

function isEnrolled(user, language) {
  const pathways = Array.isArray(user.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

// Get user progress
router.get('/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    if (!['english', 'arabic'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }
    const user = await User.findById(req.userId);

    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const { progress, completedDays, currentDay, ignoredPreLaunchDays } = await getLanguageProgressState(user, language);
    const courseSchedule = getCourseSchedule();

    res.json({
      totalXP: user.totalXP,
      courseXP: progress?.totalXP ?? 0,
      streak: user.streak,
      completedDays,
      currentDay,
      ignoredPreLaunchDays,
      badges: user.badges,
      lastActiveDate: user.lastActiveDate,
      courseSchedule,
      ...courseSchedule,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update progress after completing a lesson
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { language, day, score } = req.body;
    if (!['english', 'arabic'].includes(language) || !Number.isSafeInteger(Number(day)) || Number(day) < 1) {
      return res.status(400).json({ error: 'language and a positive day are required' });
    }
    const user = await User.findById(req.userId);

    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const normalizedDay = Number(day);
    const daySchedule = getDaySchedule(normalizedDay);
    if (!daySchedule.isReleased) {
      return res.status(403).json({
        error: daySchedule.courseStarted
          ? `This day is available from ${daySchedule.scheduledFor}.`
          : `The course begins on ${daySchedule.courseStartDate}.`,
        code: daySchedule.courseStarted ? 'DAY_NOT_RELEASED' : 'COURSE_NOT_STARTED',
        courseSchedule: getCourseSchedule(),
        daySchedule,
      });
    }

    const [lesson, progressState] = await Promise.all([
      Lesson.findOne({ language, day: normalizedDay }),
      getLanguageProgressState(user, language),
    ]);
    if (!lesson || !isDayModulePublished(lesson)) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    if (normalizedDay > progressState.currentDay) {
      return res.status(403).json({ error: 'Complete the current day before unlocking a future day' });
    }

    const videoProgress = getLessonVideoProgress(lesson, progressState.progress);
    if (getDayModuleType(lesson) === 'video' && videoProgress.enabled && !videoProgress.allCompleted) {
      return res.status(409).json({
        error: 'Complete every video in this playlist before finishing the day',
        code: 'COMPLETE_ALL_VIDEOS_FIRST',
        videoProgress,
      });
    }

    const completion = await markLanguageDayCompleted({
      user,
      language,
      day: normalizedDay,
      score,
    });

    res.json({
      message: completion.alreadyCompleted ? 'Progress was already recorded' : 'Progress updated',
      progress: completion.progress,
      completedDays: completion.completedDays,
      currentDay: completion.currentDay,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
