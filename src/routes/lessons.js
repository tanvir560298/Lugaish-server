import express from 'express';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { Quiz } from '../models/Quiz.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';
import { hasPermission } from '../utils/roles.js';
import {
  normalizeLessonScope,
  normalizeSpeakingQuestions,
  SpeakingPracticeValidationError,
} from '../utils/speakingPractice.js';

const router = express.Router();

function isEnrolled(user, language) {
  const pathways = Array.isArray(user?.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
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
// Enrolled learners can access their pathway; lesson managers can preview either pathway.
router.get('/:language/:day/speaking-practice', authMiddleware, async (req, res) => {
  try {
    const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
    const user = await User.findById(req.userId).select('enrolledPathways role');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!isEnrolled(user, language) && !hasPermission(user.role, 'manage_lessons')) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const lesson = await Lesson.findOne({ language, day }).select('speakingQuestions');
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    return res.json({ questions: lesson.speakingQuestions || [] });
  } catch (error) {
    return sendSpeakingPracticeError(error, res);
  }
});

// Replace a lesson's speaking-practice questions.
router.put(
  '/:language/:day/speaking-practice',
  authMiddleware,
  requirePermission('manage_lessons'),
  async (req, res) => {
    try {
      const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
      const questions = normalizeSpeakingQuestions(req.body?.questions, language);

      const lesson = await Lesson.findOneAndUpdate(
        { language, day },
        { $set: { speakingQuestions: questions } },
        { new: true, runValidators: true }
      ).select('day language title description speakingQuestions');

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      return res.json({
        message: 'Speaking-practice questions updated',
        lesson: {
          day: lesson.day,
          language: lesson.language,
          title: lesson.title,
          description: lesson.description,
        },
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
