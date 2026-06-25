import express from 'express';
import { InterviewQueueEntry } from '../models/InterviewQueueEntry.js';
import { User } from '../models/User.js';
import config from '../config.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';
import { ROLES, normalizeRole } from '../utils/roles.js';

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
    const sessionKey = getIsoWeekKey();
    const [user, entries] = await Promise.all([
      User.findById(req.userId).select('role'),
      getSessionEntries(sessionKey),
    ]);
    const rooms = getRooms();
    const ownEntry = entries.find(entry => String(entry.userId) === String(req.userId));
    const staff = isStaff(user);

    res.json({
      sessionKey,
      supportEmail: config.INTERVIEW_SUPPORT_EMAIL,
      totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
      totalAssigned: entries.length,
      rooms: buildRoomSummary(rooms, entries),
      ownEntry: ownEntry ? toEntryPayload(ownEntry) : null,
      entries: staff ? entries.map(toEntryPayload) : [],
      canManageQueue: staff,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/join', authMiddleware, async (req, res) => {
  try {
    const sessionKey = getIsoWeekKey();
    const rooms = getRooms();
    const user = await User.findById(req.userId).select('name email languageSelected enrolledPathways');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingEntry = await InterviewQueueEntry.findOne({ sessionKey, userId: req.userId });
    if (existingEntry) {
      return res.json({
        message: `You are #${existingEntry.roomSerial} in ${existingEntry.roomName}. Please wait and be respectful to everyone while you wait for your serial.`,
        supportEmail: config.INTERVIEW_SUPPORT_EMAIL,
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
      language: user.languageSelected || user.enrolledPathways?.[0] || 'english',
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

    res.status(500).json({ error: error.message });
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
