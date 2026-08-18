import express from 'express';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { Progress } from '../models/Progress.js';
import { Quiz } from '../models/Quiz.js';
import mongoose from 'mongoose';
import { TesterLesson } from '../models/TesterLesson.js';
import { authMiddleware, optionalAuthMiddleware, requirePermission } from '../middleware/auth.js';
import { getYouTubeId } from '../utils/youtube.js';
import { ROLES, normalizeRole } from '../utils/roles.js';

const router = express.Router();

function isEnrolled(user, language) {
  const pathways = Array.isArray(user.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

function getLessonParams(req, res) {
  const { language } = req.params;
  const day = Number(req.params.day);

  if (!['english', 'arabic'].includes(language) || !Number.isInteger(day) || day < 1 || day > 365) {
    res.status(400).json({ error: 'Invalid lesson language or day' });
    return null;
  }

  return { language, day };
}

async function getRequesterRole(userId) {
  if (!userId) return ROLES.learner;
  const user = await User.findById(userId).select('role');
  return normalizeRole(user?.role);
}

function modulePayload(lesson) {
  return {
    moduleType: lesson?.moduleType ?? 'video',
    published: lesson?.modulePublished === true,
    title: lesson?.title ?? '',
    description: lesson?.description ?? '',
    introTitle: lesson?.moduleIntroTitle ?? '',
    introText: lesson?.moduleIntroText ?? '',
    questions: Array.isArray(lesson?.speakingQuestions) ? lesson.speakingQuestions : [],
  };
}

async function getTesterContent(testerId, params) {
  const sandbox = await TesterLesson.findOne({ testerId, ...params });
  if (sandbox?.content) return sandbox.content;
  const lesson = await Lesson.findOne(params).lean();
  return lesson ?? { ...params, title: `Day ${params.day} lesson`, description: '', videos: [] };
}

async function saveTesterContent(testerId, params, content) {
  await TesterLesson.findOneAndUpdate(
    { testerId, ...params },
    { $set: { content } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return content;
}

function cleanQuestions(value, language) {
  if (!Array.isArray(value) || value.length > 30) return null;
  const ids = new Set();
  const questions = [];
  for (const raw of value) {
    const id = String(raw.id || '').trim();
    const question = String(raw.question || '').trim();
    const sampleAnswer = String(raw.sampleAnswer || '').trim();
    const expectedKeywords = Array.isArray(raw.expectedKeywords)
      ? raw.expectedKeywords.map(item => String(item).trim()).filter(Boolean)
      : [];
    const maxMarks = Number(raw.maxMarks);
    const audioUrl = raw.audioUrl ? String(raw.audioUrl).trim() : '';
    if (!/^[A-Za-z0-9_-]{1,80}$/.test(id) || ids.has(id.toLowerCase()) || !question || question.length > 500
      || !sampleAnswer || sampleAnswer.length > 2000 || !expectedKeywords.length || expectedKeywords.length > 30
      || expectedKeywords.some(item => item.length > 100) || !Number.isFinite(maxMarks) || maxMarks < 1 || maxMarks > 100) return null;
    ids.add(id.toLowerCase());
    questions.push({ id, question, language, expectedKeywords, sampleAnswer, maxMarks, ...(audioUrl ? { audioUrl } : {}) });
  }
  return questions;
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

// Get lesson by day and language
router.get('/:language/day-modules', authMiddleware, async (req, res) => {
  try {
    const { language } = req.params;
    if (!['english', 'arabic'].includes(language)) return res.status(400).json({ error: 'Invalid language' });
    const role = await getRequesterRole(req.userId);
    const liveLessons = await Lesson.find({ language }).lean();
    const sandboxLessons = role === ROLES.tester ? await TesterLesson.find({ testerId: req.userId, language }).lean() : [];
    const byDay = new Map(liveLessons.map(lesson => [Number(lesson.day), lesson]));
    sandboxLessons.forEach(item => byDay.set(Number(item.day), item.content));
    const modules = [...byDay.entries()].map(([day, lesson]) => ({
      day, ...modulePayload(lesson), configured: true, available: true,
      questionCount: lesson.speakingQuestions?.length ?? 0,
      videoCount: lesson.videos?.length ?? 0,
    })).sort((a, b) => a.day - b.day);
    res.json({ modules, courseSchedule: { courseStarted: true, calendarDay: 365 }, courseStarted: true, courseDay: 365 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:language/:day/module', authMiddleware, requirePermission('manage_lessons'), async (req, res) => {
  try {
    const params = getLessonParams(req, res);
    if (!params) return;
    const moduleType = ['video', 'ai_practice', 'interview'].includes(req.body.moduleType) ? req.body.moduleType : null;
    const title = String(req.body.title || '').trim().slice(0, 160);
    const description = String(req.body.description || '').trim().slice(0, 2000);
    const introTitle = String(req.body.introTitle || '').trim().slice(0, 160);
    const introText = String(req.body.introText || '').trim().slice(0, 2000);
    if (!moduleType || !title) return res.status(400).json({ error: 'Invalid day setup' });

    if (req.userRole === ROLES.tester) {
      const content = await getTesterContent(req.userId, params);
      const questions = cleanQuestions(req.body.questions ?? content.speakingQuestions ?? [], params.language);
      if (questions === null) return res.status(400).json({ error: 'Invalid question set' });
      if (moduleType === 'ai_practice' && req.body.published === true && questions.length === 0) return res.status(400).json({ error: 'Add at least one question before publishing AI practice' });
      Object.assign(content, { ...params, title, description, moduleType, modulePublished: req.body.published === true, moduleIntroTitle: introTitle, moduleIntroText: introText, speakingQuestions: questions });
      await saveTesterContent(req.userId, params, content);
      return res.json({ message: 'Saved only in your tester sandbox. Live content was not changed.', module: modulePayload(content), sandbox: true });
    }

    const existingLesson = await Lesson.findOne(params).lean();
    const questions = cleanQuestions(req.body.questions ?? existingLesson?.speakingQuestions ?? [], params.language);
    if (questions === null) return res.status(400).json({ error: 'Invalid question set' });
    if (moduleType === 'ai_practice' && req.body.published === true && questions.length === 0) return res.status(400).json({ error: 'Add at least one question before publishing AI practice' });
    const lesson = await Lesson.findOneAndUpdate(params, {
      $set: { title, description, moduleType, modulePublished: req.body.published === true, moduleIntroTitle: introTitle, moduleIntroText: introText, speakingQuestions: questions },
      $setOnInsert: params,
    }, { upsert: true, new: true, runValidators: true });
    res.json({ message: 'Day settings saved.', module: modulePayload(lesson) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:language/:day/speaking-practice', authMiddleware, async (req, res) => {
  try {
    const params = getLessonParams(req, res);
    if (!params) return;
    const role = await getRequesterRole(req.userId);
    const lesson = role === ROLES.tester ? await getTesterContent(req.userId, params) : await Lesson.findOne(params).lean();
    if (!lesson) return res.status(404).json({ error: 'Practice day not found' });
    const payload = modulePayload(lesson);
    if (role === ROLES.learner && (payload.moduleType !== 'ai_practice' || !payload.published)) return res.status(403).json({ error: 'This practice is not published' });
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:language/:day', optionalAuthMiddleware, async (req, res) => {
  try {
    const params = getLessonParams(req, res);
    if (!params) return;

    const role = await getRequesterRole(req.userId);
    const lesson = role === ROLES.tester ? await getTesterContent(req.userId, params) : await Lesson.findOne(params);
    if (!lesson) {
      return res.json({ ...params, videos: [] });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:language/:day/videos', authMiddleware, requirePermission('manage_lessons'), async (req, res) => {
  try {
    const params = getLessonParams(req, res);
    if (!params) return;

    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    const youtubeId = getYouTubeId(req.body.youtubeUrl);
    const durationMinutes = Number(req.body.durationMinutes);

    if (!title || title.length > 120) {
      return res.status(400).json({ error: 'Add a video topic with 120 characters or fewer' });
    }
    if (!youtubeId) {
      return res.status(400).json({ error: 'Add a valid YouTube video, share, shorts, or embed link' });
    }
    if (!Number.isFinite(durationMinutes) || durationMinutes < 1 || durationMinutes > 600) {
      return res.status(400).json({ error: 'Duration must be between 1 and 600 minutes' });
    }

    if (req.userRole === ROLES.tester) {
      const lesson = await getTesterContent(req.userId, params);
      lesson.videos = Array.isArray(lesson.videos) ? lesson.videos : [];
      if (lesson.videos.some(video => video.youtubeId === youtubeId)) return res.status(409).json({ error: 'This YouTube video is already in your sandbox lesson' });
      lesson.videos.push({ _id: new mongoose.Types.ObjectId().toString(), title, youtubeId, durationMinutes, createdBy: req.userId });
      await saveTesterContent(req.userId, params, lesson);
      return res.status(201).json({ message: 'Video added only to your tester sandbox', lesson, sandbox: true });
    }

    let lesson = await Lesson.findOne(params);
    if (!lesson) {
      lesson = new Lesson({
        ...params,
        title: typeof req.body.lessonTitle === 'string' && req.body.lessonTitle.trim()
          ? req.body.lessonTitle.trim().slice(0, 120)
          : `Day ${params.day} lesson`,
        description: typeof req.body.lessonDescription === 'string'
          ? req.body.lessonDescription.trim().slice(0, 500)
          : '',
      });
    }

    if (lesson.videos.some(video => video.youtubeId === youtubeId)) {
      return res.status(409).json({ error: 'This YouTube video is already in the lesson' });
    }

    lesson.videos.push({ title, youtubeId, durationMinutes, createdBy: req.userId });
    await lesson.save();

    res.status(201).json({ message: 'Video added to the lesson', lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:language/:day/videos/:videoId', authMiddleware, requirePermission('manage_lessons'), async (req, res) => {
  try {
    const params = getLessonParams(req, res);
    if (!params) return;

    if (req.userRole === ROLES.tester) {
      const lesson = await getTesterContent(req.userId, params);
      const before = Array.isArray(lesson.videos) ? lesson.videos.length : 0;
      lesson.videos = (lesson.videos ?? []).filter(video => String(video._id) !== req.params.videoId);
      if (lesson.videos.length === before) return res.status(404).json({ error: 'Sandbox video not found' });
      await saveTesterContent(req.userId, params, lesson);
      return res.json({ message: 'Video removed from your tester sandbox', lesson, sandbox: true });
    }

    const lesson = await Lesson.findOne(params);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const video = lesson.videos.id(req.params.videoId);
    if (!video) return res.status(404).json({ error: 'Video not found' });

    video.deleteOne();
    await lesson.save();

    res.json({ message: 'Video removed', lesson });
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
