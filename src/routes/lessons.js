import express from 'express';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { normalizeRole, ROLES } from '../utils/roles.js';
import {
  getLanguageProgressForWrite,
  getLanguageProgressState,
  markLanguageDayCompleted,
} from '../utils/dayProgress.js';
import { getCourseSchedule, getDaySchedule } from '../utils/courseSchedule.js';
import { getLessonVideoProgress, recordLessonVideoCompletion } from '../utils/videoProgress.js';
import {
  getDayModuleType,
  isDayModulePublished,
  normalizeDayModuleConfig,
  normalizeLessonScope,
  normalizeLessonVideo,
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

function sendLessonError(error, res) {
  if (error instanceof SpeakingPracticeValidationError) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(500).json({ error: error.message });
}

function getCourseSchedulePayload(schedule) {
  return {
    courseStarted: schedule.courseStarted,
    courseStartAt: schedule.courseStartAt,
    courseStartDate: schedule.courseStartDate,
    timeZone: schedule.timeZone,
    calendarDay: schedule.calendarDay,
    // Keep the client contract readable while retaining calendarDay for API
    // consumers that need to distinguish schedule date from learner progress.
    courseDay: schedule.calendarDay,
  };
}

function getDaySchedulePayload(schedule) {
  return {
    ...getCourseSchedulePayload(schedule),
    day: schedule.day,
    releaseAt: schedule.releaseAt,
    scheduledFor: schedule.scheduledFor,
    isReleased: schedule.isReleased,
  };
}

function sendScheduleAccessError(res, daySchedule) {
  const courseSchedule = getCourseSchedulePayload(daySchedule);
  if (!daySchedule.courseStarted) {
    return res.status(403).json({
      error: `The course begins on ${daySchedule.courseStartDate}.`,
      code: 'COURSE_NOT_STARTED',
      courseSchedule,
      daySchedule: getDaySchedulePayload(daySchedule),
    });
  }

  return res.status(403).json({
    error: `This day is available from ${daySchedule.scheduledFor}.`,
    code: 'DAY_NOT_RELEASED',
    courseSchedule,
    daySchedule: getDaySchedulePayload(daySchedule),
  });
}

function isLearnerDayAvailable(lesson, progressState, daySchedule) {
  return isDayModulePublished(lesson)
    && daySchedule.isReleased
    && lesson.day <= progressState.currentDay;
}

function getModulePayload(lesson, { includeQuestions = false } = {}) {
  const moduleType = getDayModuleType(lesson);
  const published = isDayModulePublished(lesson);
  const payload = {
    day: lesson.day,
    language: lesson.language,
    title: lesson.title,
    description: lesson.description ?? '',
    moduleType,
    published,
    introTitle: lesson.moduleIntroTitle ?? '',
    introText: lesson.moduleIntroText ?? '',
    questionCount: moduleType === 'ai_practice' ? (lesson.speakingQuestions?.length ?? 0) : 0,
  };

  if (includeQuestions) payload.questions = lesson.speakingQuestions ?? [];
  return payload;
}

function getPublicLessonPayload(lesson) {
  const lessonData = lesson.toObject();
  delete lessonData.speakingQuestions;
  // Quiz answers and explanations must never be sent to a learner before they
  // submit the quiz. The quiz endpoint remains the sole scoring authority.
  lessonData.quiz = (lessonData.quiz ?? []).map(question => ({
    question: question.question,
    options: question.options,
  }));
  return {
    ...lessonData,
    moduleType: getDayModuleType(lesson),
    modulePublished: isDayModulePublished(lesson),
    moduleIntroTitle: lesson.moduleIntroTitle ?? '',
    moduleIntroText: lesson.moduleIntroText ?? '',
  };
}

function getLessonPayloadWithVideoProgress(lesson, progress, { preview = false } = {}) {
  const lessonData = getPublicLessonPayload(lesson);
  if (getDayModuleType(lesson) !== 'video') return lessonData;

  const videoProgress = getLessonVideoProgress(lesson, progress);
  const completedVideoIds = new Set(videoProgress.completedVideoIds);
  lessonData.videos = (lessonData.videos ?? []).map(video => {
    const videoId = String(video?._id ?? '');
    const completed = completedVideoIds.has(videoId);
    const isLocked = !preview && !completed && videoId !== videoProgress.nextVideoId;
    const videoPayload = {
      ...video,
      completed,
      isNext: videoId === videoProgress.nextVideoId,
      // Completed videos remain rewatchable. Web Developers can freely preview
      // the whole playlist while preparing a day; learners unlock it in order.
      isLocked,
    };

    // Do not expose a future YouTube ID to learners through the API. This is a
    // course-flow lock rather than DRM, but it prevents a direct Lugaish API
    // response from bypassing the sequential playlist screen.
    if (isLocked) delete videoPayload.youtubeId;
    return videoPayload;
  });

  return {
    ...lessonData,
    videoProgress: {
      ...videoProgress,
      isPreview: preview,
    },
  };
}

function getInsertText(value, fallback, maxLength) {
  if (typeof value !== 'string') return fallback;
  const text = value.normalize('NFKC').replace(/\s+/gu, ' ').trim();
  return text ? text.slice(0, maxLength) : fallback;
}

// Get today's lesson (based on user progress)
router.get('/today/:language', authMiddleware, async (req, res) => {
  try {
    const { language } = normalizeLessonScope(req.params.language, '1');
    const user = await User.findById(req.userId);

    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const { currentDay, completedDays, progress } = await getLanguageProgressState(user, language);
    const daySchedule = getDaySchedule(currentDay);
    if (!daySchedule.isReleased) return sendScheduleAccessError(res, daySchedule);

    const lesson = await Lesson.findOne({ language, day: currentDay });
    if (!lesson || !isDayModulePublished(lesson)) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lessonData = getLessonPayloadWithVideoProgress(lesson, progress);

    return res.json({
      ...lessonData,
      userDay: currentDay,
      alreadyCompleted: completedDays.includes(currentDay),
      courseSchedule: getCourseSchedulePayload(daySchedule),
      daySchedule: getDaySchedulePayload(daySchedule),
    });
  } catch (error) {
    return sendLessonError(error, res);
  }
});

// One compact request for the Daily Lessons page. It is deliberately placed before
// the generic /:language/:day route.
router.get('/:language/day-modules', authMiddleware, async (req, res) => {
  try {
    const { language } = normalizeLessonScope(req.params.language, '1');
    const user = await User.findById(req.userId).select('enrolledPathways role languageSelected completedLessons');

    if (!user) return res.status(401).json({ error: 'User not found' });

    const webDeveloper = isWebDeveloper(user);
    if (!isEnrolled(user, language) && !webDeveloper) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const [lessons, progressState] = await Promise.all([
      Lesson.find({ language }).sort({ day: 1 }),
      getLanguageProgressState(user, language),
    ]);
    const { currentDay, completedDays, ignoredPreLaunchDays } = progressState;
    const courseSchedule = getCourseSchedule();
    const modules = lessons
      .filter(lesson => webDeveloper || isDayModulePublished(lesson))
      .map(lesson => {
        const daySchedule = getDaySchedule(lesson.day);
        return {
          ...getModulePayload(lesson),
          available: webDeveloper || isLearnerDayAvailable(lesson, progressState, daySchedule),
          daySchedule: getDaySchedulePayload(daySchedule),
        };
      });

    return res.json({
      modules,
      currentDay,
      completedDays,
      ignoredPreLaunchDays,
      canConfigure: webDeveloper,
      courseSchedule: getCourseSchedulePayload(courseSchedule),
      ...getCourseSchedulePayload(courseSchedule),
    });
  } catch (error) {
    return sendLessonError(error, res);
  }
});

// The Web Developer owns the daily course plan. This endpoint can also create a
// future day, allowing Day 2 to be an AI test rather than a video lesson.
router.put(
  '/:language/:day/module',
  authMiddleware,
  requireRole(ROLES.webDeveloper),
  async (req, res) => {
    try {
      const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
      const config = normalizeDayModuleConfig(req.body);
      const existingLesson = await Lesson.findOne({ language, day });
      const questions = req.body?.questions === undefined
        ? (existingLesson?.speakingQuestions ?? [])
        : normalizeSpeakingQuestions(req.body.questions, language);

      if (config.moduleType === 'ai_practice' && config.published && questions.length === 0) {
        return res.status(400).json({ error: 'Add at least one question before publishing an AI practice day' });
      }

      const hasPlaylistVideo = (existingLesson?.videos?.length ?? 0) > 0;
      const hasLegacyVideo = typeof existingLesson?.videoUrl === 'string' && existingLesson.videoUrl.trim();
      const isExistingPublishedVideoDay = existingLesson
        && getDayModuleType(existingLesson) === 'video'
        && isDayModulePublished(existingLesson);
      if (
        config.moduleType === 'video'
        && config.published
        && !hasPlaylistVideo
        && !hasLegacyVideo
        && !isExistingPublishedVideoDay
      ) {
        return res.status(400).json({ error: 'Add at least one YouTube video before publishing a new video day' });
      }

      const lesson = await Lesson.findOneAndUpdate(
        { language, day },
        {
          $set: {
            title: config.title,
            description: config.description,
            moduleType: config.moduleType,
            modulePublished: config.published,
            moduleIntroTitle: config.introTitle,
            moduleIntroText: config.introText,
            speakingPracticeEnabled: config.moduleType === 'ai_practice' && config.published,
            speakingQuestions: questions,
          },
          $setOnInsert: { language, day },
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      return res.json({
        message: config.published ? 'Day module is live for learners' : 'Day module draft saved privately',
        module: getModulePayload(lesson, { includeQuestions: true }),
      });
    } catch (error) {
      return sendLessonError(error, res);
    }
  }
);

// Get the AI-practice questions only when this day is configured as AI practice.
// Web Developers can preview private drafts; learners cannot.
router.get('/:language/:day/speaking-practice', authMiddleware, async (req, res) => {
  try {
    const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
    const user = await User.findById(req.userId).select('enrolledPathways role languageSelected completedLessons');

    if (!user) return res.status(401).json({ error: 'User not found' });

    const webDeveloper = isWebDeveloper(user);
    if (!isEnrolled(user, language) && !webDeveloper) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const lesson = await Lesson.findOne({ language, day }).select(
      'day language title description moduleType modulePublished moduleIntroTitle moduleIntroText speakingQuestions'
    );
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const progressState = await getLanguageProgressState(user, language);
    const daySchedule = getDaySchedule(day);
    const isPracticeDay = getDayModuleType(lesson) === 'ai_practice';
    const published = isDayModulePublished(lesson);
    const available = isPracticeDay && isLearnerDayAvailable(lesson, progressState, daySchedule);
    if (!webDeveloper && !daySchedule.isReleased) {
      return sendScheduleAccessError(res, daySchedule);
    }
    if (!webDeveloper && (!isPracticeDay || !published || !available)) {
      return res.status(403).json({ error: 'This AI practice session is not available yet' });
    }

    return res.json({
      ...getModulePayload(lesson, { includeQuestions: webDeveloper || available }),
      enabled: isPracticeDay && published,
      available: webDeveloper || available,
      courseSchedule: getCourseSchedulePayload(daySchedule),
      daySchedule: getDaySchedulePayload(daySchedule),
    });
  } catch (error) {
    return sendLessonError(error, res);
  }
});

// Kept for the currently deployed client while it transitions to the day-module
// feed. It returns only scheduled, learner-visible practice days.
router.get('/:language/speaking-practice-availability', authMiddleware, async (req, res) => {
  try {
    const { language } = normalizeLessonScope(req.params.language, '1');
    const user = await User.findById(req.userId).select('enrolledPathways role languageSelected completedLessons');
    if (!user) return res.status(401).json({ error: 'User not found' });

    const webDeveloper = isWebDeveloper(user);
    if (!isEnrolled(user, language) && !webDeveloper) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const [progressState, lessons] = await Promise.all([
      getLanguageProgressState(user, language),
      Lesson.find({ language }).select('day moduleType modulePublished speakingPracticeEnabled'),
    ]);
    const courseSchedule = getCourseSchedule();
    const enabledDays = lessons
      .filter(lesson => getDayModuleType(lesson) === 'ai_practice')
      .filter(lesson => webDeveloper || isLearnerDayAvailable(lesson, progressState, getDaySchedule(lesson.day)))
      .map(lesson => lesson.day)
      .sort((first, second) => first - second);

    return res.json({
      enabledDays,
      courseSchedule: getCourseSchedulePayload(courseSchedule),
    });
  } catch (error) {
    return sendLessonError(error, res);
  }
});

// Compatibility route for the already-deployed prototype. New client code uses
// /module so type, intro, publish state, and questions are saved together.
router.put(
  '/:language/:day/speaking-practice',
  authMiddleware,
  requireRole(ROLES.webDeveloper),
  async (req, res) => {
    try {
      const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
      const lesson = await Lesson.findOne({ language, day });
      if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

      const enabled = req.body?.enabled === undefined
        ? getDayModuleType(lesson) === 'ai_practice' && isDayModulePublished(lesson)
        : normalizeSpeakingPracticeEnabled(req.body.enabled);
      const questions = normalizeSpeakingQuestions(req.body?.questions, language);
      if (enabled && questions.length === 0) {
        return res.status(400).json({ error: 'Add at least one question before enabling AI practice' });
      }

      lesson.moduleType = 'ai_practice';
      lesson.modulePublished = enabled;
      lesson.speakingPracticeEnabled = enabled;
      lesson.speakingQuestions = questions;
      await lesson.save();

      return res.json({
        message: enabled ? 'AI practice is now available to learners' : 'AI practice draft saved privately',
        ...getModulePayload(lesson, { includeQuestions: true }),
        enabled,
      });
    } catch (error) {
      return sendLessonError(error, res);
    }
  }
);

// Existing client UI already sends YouTube links to these routes. Defining them
// server-side makes that management flow persist instead of failing at the API.
router.post(
  '/:language/:day/videos',
  authMiddleware,
  requireRole(ROLES.webDeveloper),
  async (req, res) => {
    try {
      const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
      const video = normalizeLessonVideo(req.body);
      const existingLesson = await Lesson.findOne({ language, day });
      if (existingLesson && getDayModuleType(existingLesson) !== 'video') {
        return res.status(409).json({ error: 'Change this day back to a video module before adding videos' });
      }

      const lesson = await Lesson.findOneAndUpdate(
        { language, day },
        {
          $setOnInsert: {
            language,
            day,
            title: getInsertText(req.body?.lessonTitle, `Day ${day} lesson`, 160),
            description: getInsertText(req.body?.lessonDescription, '', 2000),
            moduleType: 'video',
            // A brand-new day remains private until the Web Developer publishes
            // its course setup. Existing legacy video days stay published.
            modulePublished: false,
          },
          $push: { videos: video },
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      return res.status(201).json({ message: 'Video added to the lesson', lesson: getPublicLessonPayload(lesson) });
    } catch (error) {
      return sendLessonError(error, res);
    }
  }
);

router.delete(
  '/:language/:day/videos/:videoId',
  authMiddleware,
  requireRole(ROLES.webDeveloper),
  async (req, res) => {
    try {
      const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
      const lesson = await Lesson.findOne({ language, day });
      if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
      if (getDayModuleType(lesson) !== 'video') {
        return res.status(409).json({ error: 'Videos can only be managed on a video module day' });
      }

      const before = lesson.videos.length;
      lesson.videos = lesson.videos.filter(video => String(video._id) !== req.params.videoId);
      if (lesson.videos.length === before) return res.status(404).json({ error: 'Video not found' });

      await lesson.save();
      return res.json({ message: 'Video removed from the lesson', lesson: getPublicLessonPayload(lesson) });
    } catch (error) {
      return sendLessonError(error, res);
    }
  }
);

// Complete one playlist video. Learners unlock videos in the exact order set by
// the Web Developer; completing every video is required before the day itself
// can unlock the next scheduled module.
router.post('/:language/:day/videos/:videoId/complete', authMiddleware, async (req, res) => {
  try {
    const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
    const videoId = typeof req.params.videoId === 'string' ? req.params.videoId.trim() : '';
    if (!videoId) return res.status(400).json({ error: 'A video ID is required' });

    const user = await User.findById(req.userId).select('enrolledPathways role languageSelected completedLessons');
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (isWebDeveloper(user)) {
      return res.status(403).json({ error: 'Web Developers can preview playlists but cannot record learner video progress' });
    }
    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const daySchedule = getDaySchedule(day);
    if (!daySchedule.isReleased) return sendScheduleAccessError(res, daySchedule);

    const [lesson, progressState] = await Promise.all([
      Lesson.findOne({ language, day }),
      getLanguageProgressForWrite(user, language),
    ]);
    if (!lesson || !isDayModulePublished(lesson)) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    if (getDayModuleType(lesson) !== 'video') {
      return res.status(409).json({ error: 'Individual videos can only be completed on a video lesson day' });
    }
    if (day > progressState.currentDay) {
      return res.status(403).json({ error: 'Complete the current day before opening a future video day' });
    }
    if (progressState.completedDays.includes(day)) {
      return res.status(409).json({ error: 'This video day is already complete' });
    }

    const requestedVideo = (lesson.videos ?? []).find(video => String(video._id) === videoId);
    if (!requestedVideo) {
      return res.status(404).json({ error: 'Video not found in this lesson' });
    }

    const videoProgress = getLessonVideoProgress(lesson, progressState.progress);
    const lessonPayload = () => getLessonPayloadWithVideoProgress(lesson, progressState.progress);
    if (videoProgress.completedVideoIds.includes(videoId)) {
      return res.json({
        message: 'Video was already completed',
        lesson: lessonPayload(),
        videoProgress,
      });
    }
    if (videoProgress.allCompleted || videoProgress.nextVideoId === null) {
      return res.status(409).json({
        error: 'All videos are complete. Finish the video day to unlock the next module',
        code: 'VIDEO_DAY_READY_TO_FINISH',
        lesson: lessonPayload(),
        videoProgress,
      });
    }
    if (videoProgress.nextVideoId !== videoId) {
      return res.status(409).json({
        error: 'Finish the previous video before opening this one',
        code: 'VIDEO_LOCKED',
        lesson: lessonPayload(),
        videoProgress,
      });
    }

    recordLessonVideoCompletion(progressState.progress, day, videoId);
    await progressState.progress.save();

    const updatedVideoProgress = getLessonVideoProgress(lesson, progressState.progress);
    return res.json({
      message: updatedVideoProgress.allCompleted
        ? 'All videos are complete. Finish this day to unlock the next module.'
        : 'Video complete. The next video is now unlocked.',
      lesson: getLessonPayloadWithVideoProgress(lesson, progressState.progress),
      videoProgress: updatedVideoProgress,
    });
  } catch (error) {
    return sendLessonError(error, res);
  }
});

// Get the selected daily module. Learners may only open an enrolled, published
// day that has already been unlocked; Web Developers may preview drafts.
router.get('/:language/:day', authMiddleware, async (req, res) => {
  try {
    const { language, day } = normalizeLessonScope(req.params.language, req.params.day);
    const user = await User.findById(req.userId).select('enrolledPathways role languageSelected completedLessons');
    if (!user) return res.status(401).json({ error: 'User not found' });

    const webDeveloper = isWebDeveloper(user);
    if (!isEnrolled(user, language) && !webDeveloper) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }

    const lesson = await Lesson.findOne({ language, day });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const daySchedule = getDaySchedule(day);
    let progress = null;
    if (!webDeveloper) {
      const progressState = await getLanguageProgressState(user, language);
      const { currentDay } = progressState;
      if (!daySchedule.isReleased) return sendScheduleAccessError(res, daySchedule);
      if (!isDayModulePublished(lesson) || day > currentDay) {
        return res.status(403).json({ error: 'This day is not available yet' });
      }
      progress = progressState.progress;
    }

    return res.json({
      ...getLessonPayloadWithVideoProgress(lesson, progress, { preview: webDeveloper }),
      courseSchedule: getCourseSchedulePayload(daySchedule),
      daySchedule: getDaySchedulePayload(daySchedule),
    });
  } catch (error) {
    return sendLessonError(error, res);
  }
});

// Complete the currently available day. Progress is stored per language, so an
// English completion never unlocks the Arabic course (or the reverse).
router.post('/complete', authMiddleware, async (req, res) => {
  try {
    const language = typeof req.body?.language === 'string' ? req.body.language.trim().toLowerCase() : '';
    const day = Number(req.body?.day);
    if (!['english', 'arabic'].includes(language) || !Number.isSafeInteger(day) || day < 1) {
      return res.status(400).json({ error: 'language and a positive day are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!isEnrolled(user, language)) {
      return res.status(403).json({ error: 'Not enrolled in this language' });
    }
    const daySchedule = getDaySchedule(day);
    if (!daySchedule.isReleased) return sendScheduleAccessError(res, daySchedule);

    const progressState = await getLanguageProgressState(user, language);
    if (day > progressState.currentDay) {
      return res.status(403).json({ error: 'Complete the current day before unlocking a future day' });
    }

    const lesson = await Lesson.findOne({ language, day });
    if (!lesson || !isDayModulePublished(lesson)) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const videoProgress = getLessonVideoProgress(lesson, progressState.progress);
    if (getDayModuleType(lesson) === 'video' && videoProgress.enabled && !videoProgress.allCompleted) {
      return res.status(409).json({
        error: 'Complete every video in this playlist before finishing the day',
        code: 'COMPLETE_ALL_VIDEOS_FIRST',
        videoProgress,
      });
    }

    const completion = await markLanguageDayCompleted({ user, language, day, score: 100 });
    return res.json({
      message: completion.alreadyCompleted ? 'Lesson was already completed' : 'Lesson completed',
      user,
      progress: completion.progress,
      completedDays: completion.completedDays,
      currentDay: completion.currentDay,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
