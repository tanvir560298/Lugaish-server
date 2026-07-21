import express from 'express';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { Quiz } from '../models/Quiz.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { normalizeRole, ROLES } from '../utils/roles.js';
import {
  normalizeLessonScope,
  normalizeSpeakingPracticeEnabled,
  normalizeSpeakingQuestions,
  SpeakingPracticeValidationError,
} from '../utils/speakingPractice.js';

const router = express.Router();

function isEnrolled(user, language) {
  const pathways = Array.isArray(user?.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

function isWebDeveloper(user) {
  return normalizeRole(user?.role) === ROLES.webDeveloper;
}

function sendSpeakingPracticeError(error, res) {
  if (error instanceof SpeakingPracticeValidationError) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: error.message });
}

// Get today's lesson (based on user progress)
router.get('/today/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    const user = await User.findById(req.userId);

    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
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
    delete lessonData.speakingQuestions;

    res.json({
      ...lessonData,
      userDay: user.currentDay,
      alreadyCompleted: user.completedLessons.includes(user.currentDay),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the speaking-practice questions for a lesson.
// Only the Web Developer can preview drafts. Learners receive questions only after the
// Web Developer explicitly enables the practice for that day.
router.get('/:language/:day/speaking-practice', authMiddleware, async (req, res) => {
  try {
    const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
    const user = await User.findById(req.userId).select('enrolledPathways role currentDay');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const webDeveloper = isWebDeveloper(user);
    if (!isEnrolled(user, language) && !webDeveloper) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }
    if (!webDeveloper && day > Math.max(Number(user.currentDay) || 1, 1)) {
      return res.status(403).json({ error: 'This lesson is not available yet' });
    }

    const lesson = await Lesson.findOne({ language, day }).select('speakingPracticeEnabled speakingQuestions');
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const enabled = Boolean(lesson.speakingPracticeEnabled);
    return res.json({
      enabled,
      questions: webDeveloper || enabled ? lesson.speakingQuestions || [] : [],
    });
  } catch (error) {
    return sendSpeakingPracticeError(error, res);
  }
});

// List enabled practice days. This lets the client hide unavailable tests without
// making a separate request for every lesson card.
router.get('/:language/speaking-practice-availability', authMiddleware, async (req, res) => {
  try {
    const { language } = normalizeLessonScope(req.params.language, '1');
    const user = await User.findById(req.userId).select('enrolledPathways role currentDay');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const webDeveloper = isWebDeveloper(user);
    if (!isEnrolled(user, language) && !webDeveloper) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const lessonFilter = { language, speakingPracticeEnabled: true };
    if (!webDeveloper) {
      lessonFilter.day = { $lte: Math.max(Number(user.currentDay) || 1, 1) };
    }

    const lessons = await Lesson.find(lessonFilter).select('day').sort({ day: 1 });
    return res.json({ enabledDays: lessons.map(lesson => lesson.day) });
  } catch (error) {
    return sendSpeakingPracticeError(error, res);
  }
});

// Replace a lesson's speaking-practice draft and decide whether learners can see it.
router.put(
  '/:language/:day/speaking-practice',
  authMiddleware,
  requireRole(ROLES.webDeveloper),
  async (req, res) => {
    try {
      const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
      const enabled = req.body?.enabled === undefined
        ? false
        : normalizeSpeakingPracticeEnabled(req.body.enabled);
      const questions = normalizeSpeakingQuestions(req.body?.questions, language);
      if (enabled && questions.length === 0) {
        return res.status(400).json({ error: 'Add at least one question before enabling AI practice' });
      }

      const lesson = await Lesson.findOneAndUpdate(
        { language, day },
        { $set: { speakingPracticeEnabled: enabled, speakingQuestions: questions } },
        { new: true, runValidators: true }
      ).select('day language title description speakingPracticeEnabled speakingQuestions');

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      return res.json({
        message: enabled ? 'AI practice is now available to learners' : 'AI practice draft saved privately',
        lesson: {
          day: lesson.day,
          language: lesson.language,
          title: lesson.title,
          description: lesson.description,
        },
        enabled: Boolean(lesson.speakingPracticeEnabled),
        questions: lesson.speakingQuestions,
      });
    } catch (error) {
      return sendSpeakingPracticeError(error, res);
    }
  }
);

// Get lesson by day and language
router.get('/:language/:day', async (req, res) => {
  try {
    const { language, day } = req.params;

    const lesson = await Lesson.findOne({ language, day: Number(day) });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Speaking-practice answer criteria are available only through authenticated routes.
    const lessonData = lesson.toObject();
    delete lessonData.speakingQuestions;

    res.json(lessonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete lesson
router.post('/complete', authMiddleware, async (req, res) => {
  try {
    const { day, language } = req.body;
    const user = await User.findById(req.userId);

    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
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
