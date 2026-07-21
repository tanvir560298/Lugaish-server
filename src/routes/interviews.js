import express from 'express';
import { InterviewQueueEntry } from '../models/InterviewQueueEntry.js';
import { Lesson } from '../models/Lesson.js';
import { User } from '../models/User.js';
import config from '../config.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';
import { ROLES, normalizeRole } from '../utils/roles.js';
import { getLanguageProgressState } from '../utils/dayProgress.js';
import { getCourseSchedule, getDaySchedule } from '../utils/courseSchedule.js';
import {
  getDayModuleType,
  isDayModulePublished,
  normalizeLessonScope,
  SpeakingPracticeValidationError,
} from '../utils/speakingPractice.js';

const router = express.Router();

function getIsoWeekKey(date = new Date()) {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
  return `${target.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

function getRooms() {
  const urls = config.INTERVIEW_ROOM_URLS.split(',').map(url => url.trim()).filter(Boolean);
  const capacities = config.INTERVIEW_ROOM_CAPACITIES.split(',')
    .map(value => Number(value.trim()))
    .filter(value => Number.isFinite(value) && value > 0);
  const roomCount = Math.max(urls.length, capacities.length, 4);

  return Array.from({ length: roomCount }, (_, index) => ({
    roomIndex: index,
    roomName: `Room ${index + 1}`,
    meetUrl: urls[index] || 'https://meet.google.com/',
    capacity: capacities[index] || 25,
  }));
}

function isStaff(user) {
  return normalizeRole(user?.role) !== ROLES.learner;
}

function isWebDeveloper(user) {
  return normalizeRole(user?.role) === ROLES.webDeveloper;
}

function isEnrolled(user, language) {
  const pathways = Array.isArray(user?.enrolledPathways) ? user.enrolledPathways : [];
  return pathways.includes(language);
}

class InterviewAccessError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.name = 'InterviewAccessError';
    this.status = status;
    this.code = details.code;
    this.courseSchedule = details.courseSchedule;
    this.daySchedule = details.daySchedule;
  }
}

function normalizeInterviewScope(value) {
  const dayValue = typeof value?.day === 'number' ? String(value.day) : value?.day;
  return normalizeLessonScope(value?.language, dayValue);
}

function getDayModulePayload(lesson) {
  return {
    day: lesson.day,
    language: lesson.language,
    title: lesson.title,
    description: lesson.description ?? '',
    introTitle: lesson.moduleIntroTitle ?? '',
    introText: lesson.moduleIntroText ?? '',
  };
}

async function getInterviewDayAccess(userId, scope) {
  const { language, day } = normalizeInterviewScope(scope);
  const [user, lesson] = await Promise.all([
    User.findById(userId).select('name email languageSelected enrolledPathways completedLessons role'),
    Lesson.findOne({ language, day }).select(
      'day language title description moduleType modulePublished moduleIntroTitle moduleIntroText'
    ),
  ]);

  if (!user) throw new InterviewAccessError(401, 'User not found');

  const webDeveloper = isWebDeveloper(user);
  if (!webDeveloper && !isEnrolled(user, language)) {
    throw new InterviewAccessError(403, 'Not enrolled in this language');
  }

  if (!lesson || getDayModuleType(lesson) !== 'interview') {
    throw new InterviewAccessError(404, 'This day is not configured as an interview session');
  }

  const daySchedule = getDaySchedule(day);
  if (!webDeveloper && !daySchedule.isReleased) {
    throw new InterviewAccessError(
      403,
      daySchedule.courseStarted
        ? `This day is available from ${daySchedule.scheduledFor}.`
        : `The course begins on ${daySchedule.courseStartDate}.`,
      {
        code: daySchedule.courseStarted ? 'DAY_NOT_RELEASED' : 'COURSE_NOT_STARTED',
        courseSchedule: getCourseSchedule(),
        daySchedule,
      }
    );
  }

  const { currentDay } = await getLanguageProgressState(user, language);
  const available = day <= currentDay;
  if (!webDeveloper && (!isDayModulePublished(lesson) || !available)) {
    throw new InterviewAccessError(403, 'This interview session is not available yet');
  }

  return {
    user,
    language,
    day,
    dayModule: getDayModulePayload(lesson),
    courseSchedule: getCourseSchedule(),
    daySchedule,
    canJoinInterview: !webDeveloper,
  };
}

function sendInterviewError(error, res) {
  if (error instanceof SpeakingPracticeValidationError) {
    return res.status(400).json({ error: error.message });
  }
  if (error instanceof InterviewAccessError) {
    return res.status(error.status).json({
      error: error.message,
      ...(error.code ? { code: error.code } : {}),
      ...(error.courseSchedule ? { courseSchedule: error.courseSchedule } : {}),
      ...(error.daySchedule ? { daySchedule: error.daySchedule } : {}),
    });
  }
  return res.status(500).json({ error: error.message });
}

function toEntryPayload(entry) {
  return {
    id: entry._id,
    sessionKey: entry.sessionKey,
    userId: entry.userId,
    name: entry.name,
    email: entry.email,
    language: entry.language,
    roomIndex: entry.roomIndex,
    roomName: entry.roomName,
    meetUrl: entry.meetUrl,
    globalSerial: entry.globalSerial,
    roomSerial: entry.roomSerial,
    status: entry.status,
    joinedAt: entry.joinedAt,
    updatedAt: entry.updatedAt,
  };
}

function buildRoomSummary(rooms, entries) {
  return rooms.map(room => {
    const roomEntries = entries.filter(entry => entry.roomIndex === room.roomIndex);

    return {
      ...room,
      assignedCount: roomEntries.length,
      waitingCount: roomEntries.filter(entry => entry.status === 'waiting').length,
      doneCount: roomEntries.filter(entry => entry.status === 'done').length,
      skippedCount: roomEntries.filter(entry => entry.status === 'skipped').length,
      isFull: roomEntries.length >= room.capacity,
    };
  });
}

async function getSessionEntries(sessionKey) {
  return InterviewQueueEntry.find({ sessionKey }).sort({ globalSerial: 1, createdAt: 1 });
}

router.get('/weekly', authMiddleware, async (req, res) => {
  try {
    // A queue is only reachable from a configured daily interview module.
    // Requiring the language/day context prevents `/interview` from becoming a
    // generic bypass around the course schedule.
    const access = await getInterviewDayAccess(req.userId, req.query);
    const sessionKey = getIsoWeekKey();
    const entries = await getSessionEntries(sessionKey);
    const rooms = getRooms();
    const ownEntry = entries.find(entry => String(entry.userId) === String(req.userId));
    const staff = isStaff(access.user);

    res.json({
      sessionKey,
      dayModule: access.dayModule,
      courseSchedule: access.courseSchedule,
      daySchedule: access.daySchedule,
      supportEmail: config.INTERVIEW_SUPPORT_EMAIL,
      totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
      totalAssigned: entries.length,
      rooms: buildRoomSummary(rooms, entries),
      ownEntry: ownEntry ? toEntryPayload(ownEntry) : null,
      entries: staff ? entries.map(toEntryPayload) : [],
      canManageQueue: staff,
      canJoinInterview: access.canJoinInterview,
    });
  } catch (error) {
    return sendInterviewError(error, res);
  }
});

router.post('/join', authMiddleware, async (req, res) => {
  try {
    const access = await getInterviewDayAccess(req.userId, req.body);
    if (!access.canJoinInterview) {
      return res.status(403).json({ error: 'Web Developers can preview this interview day but cannot join the learner queue' });
    }

    const sessionKey = getIsoWeekKey();
    const rooms = getRooms();
    const user = access.user;

    const existingEntry = await InterviewQueueEntry.findOne({ sessionKey, userId: req.userId });
    if (existingEntry) {
      return res.json({
        message: `You are #${existingEntry.roomSerial} in ${existingEntry.roomName}. Please wait and be respectful to everyone while you wait for your serial.`,
        supportEmail: config.INTERVIEW_SUPPORT_EMAIL,
        dayModule: access.dayModule,
        entry: toEntryPayload(existingEntry),
      });
    }

    const entries = await getSessionEntries(sessionKey);
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

    if (entries.length >= totalCapacity) {
      return res.status(409).json({
        error: 'All interview rooms are full for this weekly session. Please try again in the next session.',
        code: 'INTERVIEW_FULL',
        supportEmail: config.INTERVIEW_SUPPORT_EMAIL,
      });
    }

    let assignedRoom = null;
    let roomSerial = 0;
    for (const room of rooms) {
      const assignedCount = entries.filter(entry => entry.roomIndex === room.roomIndex).length;
      if (assignedCount < room.capacity) {
        assignedRoom = room;
        roomSerial = assignedCount + 1;
        break;
      }
    }

    const entry = await InterviewQueueEntry.create({
      sessionKey,
      userId: req.userId,
      name: user.name,
      email: user.email,
      language: access.language,
      roomIndex: assignedRoom.roomIndex,
      roomName: assignedRoom.roomName,
      meetUrl: assignedRoom.meetUrl,
      globalSerial: entries.length + 1,
      roomSerial,
      status: 'waiting',
      joinedAt: new Date(),
    });

    res.status(201).json({
      message: `You are #${entry.roomSerial} in ${entry.roomName}. Please wait and be respectful to everyone while you wait for your serial.`,
      supportEmail: config.INTERVIEW_SUPPORT_EMAIL,
      dayModule: access.dayModule,
      entry: toEntryPayload(entry),
    });
  } catch (error) {
    if (error.code === 11000) {
      const entry = await InterviewQueueEntry.findOne({ sessionKey: getIsoWeekKey(), userId: req.userId });
      if (entry) {
        return res.json({
          message: `You are #${entry.roomSerial} in ${entry.roomName}. Please wait and be respectful to everyone while you wait for your serial.`,
          supportEmail: config.INTERVIEW_SUPPORT_EMAIL,
          entry: toEntryPayload(entry),
        });
      }
    }

    return sendInterviewError(error, res);
  }
});

router.patch('/entries/:id/status', authMiddleware, requirePermission('manage_lessons'), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['waiting', 'done', 'skipped'].includes(status)) {
      return res.status(400).json({ error: 'Invalid interview status' });
    }

    const entry = await InterviewQueueEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: 'Queue entry not found' });
    }

    entry.status = status;
    entry.updatedBy = req.userId;
    await entry.save();

    res.json({
      message: 'Interview queue updated',
      entry: toEntryPayload(entry),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
