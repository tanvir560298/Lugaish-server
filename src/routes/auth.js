import express from 'express';
import jwt from 'jsonwebtoken';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { User } from '../models/User.js';
import config from '../config.js';
import { authMiddleware, requirePermission } from '../middleware/auth.js';
import { ROLE_LABELS, ROLE_VALUES, ROLES, getRolePermissions, normalizeRole } from '../utils/roles.js';

const router = express.Router();

if (!getApps().length) {
  initializeApp({
    projectId: config.FIREBASE_PROJECT_ID || undefined,
  });
}

const webDeveloperEmails = new Set(
  ['tahmadium@gmail.com', ...config.WEB_DEVELOPER_EMAILS.split(',')]
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
);

function normalizePathways(pathways, fallback = 'english', { includeFallback = true } = {}) {
  const valid = new Set(['english', 'arabic']);
  const normalized = Array.isArray(pathways)
    ? pathways.filter(pathway => valid.has(pathway))
    : [];

  if (includeFallback && valid.has(fallback)) normalized.unshift(fallback);
  return [...new Set(normalized)];
}

async function getEnrollmentCount(language) {
  return User.countDocuments({ enrolledPathways: language });
}

function getCourseSeatLimit(language) {
  return Math.max(config.COURSE_SEAT_LIMITS?.[language] ?? config.COURSE_SEAT_LIMIT, 0);
}

async function getUserFromOptionalToken(req) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : '';

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    return User.findById(decoded.userId);
  } catch {
    return null;
  }
}

function getCapacityPayload(language, user = null) {
  const pathways = user ? normalizePathways(user.enrolledPathways, user.languageSelected, { includeFallback: false }) : [];
  const applications = user?.seatApplications ?? [];
  const latestApplication = applications
    .filter(application => application.language === language)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];

  return {
    isEnrolled: pathways.includes(language),
    hasApplied: Boolean(latestApplication),
    applicationStatus: latestApplication?.status ?? null,
  };
}

function toPublicUser(user) {
  const role = normalizeRole(user.role);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    languageSelected: user.languageSelected,
    enrolledPathways: normalizePathways(user.enrolledPathways, user.languageSelected, { includeFallback: false }),
    role,
    roleLabel: ROLE_LABELS[role],
    permissions: getRolePermissions(role),
    avatarUrl: user.avatarUrl,
    learnerProfile: user.learnerProfile ?? {},
    seatApplications: user.seatApplications ?? [],
  };
}

function cleanLearnerProfile(profile = {}) {
  const allowedFields = ['profession', 'expectation', 'courseDuration', 'referralSource'];

  return allowedFields.reduce((acc, key) => {
    if (typeof profile[key] === 'string' && profile[key].trim()) {
      acc[key] = profile[key].trim().slice(0, 300);
    }

    return acc;
  }, {});
}

async function verifyFirebaseToken(idToken) {
  if (!config.FIREBASE_PROJECT_ID) {
    throw new Error('Firebase login is not configured');
  }

  const payload = await getAuth().verifyIdToken(idToken);

  if (!payload?.uid || !payload?.email) {
    throw new Error('Invalid Firebase account');
  }

  return payload;
}

// Signup
router.post('/signup', (req, res) => {
  return res.status(410).json({ error: 'Password signup is disabled. Use Google sign in.' });
});

// Login
router.post('/login', (req, res) => {
  return res.status(410).json({ error: 'Password login is disabled. Use Google sign in.' });
});

// Firebase Google-only signup/signin
router.post('/firebase', async (req, res) => {
  try {
    const { idToken, languageSelected, displayName, learnerProfile } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Missing Firebase token' });
    }

    const selectedLanguage = ['english', 'arabic'].includes(languageSelected) ? languageSelected : 'english';
    const selectedLanguageEnrollmentCount = await getEnrollmentCount(selectedLanguage);
    const selectedLanguageLimit = getCourseSeatLimit(selectedLanguage);
    const selectedLanguageHasSeat = selectedLanguageEnrollmentCount < selectedLanguageLimit;
    const firebaseUser = await verifyFirebaseToken(idToken);
    const firebaseEmail = firebaseUser.email.toLowerCase();
    const shouldBootstrapWebDeveloper = webDeveloperEmails.has(firebaseEmail);
    const cleanedProfile = cleanLearnerProfile(learnerProfile);
    const preferredName = typeof displayName === 'string' && displayName.trim()
      ? displayName.trim().slice(0, 80)
      : '';

    let user = await User.findOne({
      $or: [
        { firebaseUid: firebaseUser.uid },
        { email: firebaseUser.email },
      ],
    });

    if (!user) {
      user = new User({
        name: preferredName || firebaseUser.name || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        authProvider: 'firebase',
        firebaseUid: firebaseUser.uid,
        avatarUrl: firebaseUser.picture,
        role: shouldBootstrapWebDeveloper ? ROLES.webDeveloper : ROLES.learner,
        languageSelected: selectedLanguage,
        enrolledPathways: selectedLanguageHasSeat ? [selectedLanguage] : [],
        learnerProfile: cleanedProfile,
      });
    } else {
      user.authProvider = 'firebase';
      user.firebaseUid = user.firebaseUid || firebaseUser.uid;
      user.avatarUrl = firebaseUser.picture || user.avatarUrl;
      user.name = preferredName || user.name;
      if (shouldBootstrapWebDeveloper && normalizeRole(user.role) !== ROLES.webDeveloper) {
        user.role = ROLES.webDeveloper;
      }
      user.learnerProfile = {
        ...(user.learnerProfile?.toObject?.() ?? user.learnerProfile ?? {}),
        ...cleanedProfile,
      };
      user.enrolledPathways = normalizePathways(user.enrolledPathways, user.languageSelected);
    }

    await user.save();

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Google login successful',
      token,
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Check course seat availability before a learner enters a pathway
router.get('/enrollment-status/:language', async (req, res) => {
  try {
    const { language } = req.params;
    if (!['english', 'arabic'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const [enrolledCount, user] = await Promise.all([
      getEnrollmentCount(language),
      getUserFromOptionalToken(req),
    ]);
    const limit = getCourseSeatLimit(language);
    const seatsAvailable = limit === 0 ? 0 : Math.max(limit - enrolledCount, 0);

    res.json({
      language,
      limit,
      enrolledCount,
      seatsAvailable,
      isFull: seatsAvailable <= 0,
      ...getCapacityPayload(language, user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in an additional language pathway
router.post('/enroll', authMiddleware, async (req, res) => {
  try {
    const { language } = req.body;
    if (!['english', 'arabic'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.enrolledPathways = normalizePathways(user.enrolledPathways, user.languageSelected);
    const enrolledCount = await getEnrollmentCount(language);
    const alreadyEnrolled = user.enrolledPathways.includes(language);

    const limit = getCourseSeatLimit(language);

    if (!alreadyEnrolled && enrolledCount >= limit) {
      return res.status(409).json({
        error: 'This cohort is currently full. Apply for a priority seat and our team will get back to you.',
        code: 'COURSE_FULL',
        language,
        limit,
        enrolledCount,
      });
    }

    if (!user.enrolledPathways.includes(language)) {
      user.enrolledPathways.push(language);
    }
    user.languageSelected = language;

    await user.save();

    res.json({
      message: 'Enrollment updated',
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for a seat when the current cohort is full
router.post('/seat-applications', authMiddleware, async (req, res) => {
  try {
    const { language, goal = '', availability = '', contactPreference = '' } = req.body;
    if (!['english', 'arabic'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingPending = user.seatApplications?.find(application => (
      application.language === language && application.status === 'pending'
    ));

    if (existingPending) {
      return res.json({
        message: 'Your application is already with our team. We will get back to you soon.',
        application: existingPending,
        user: toPublicUser(user),
      });
    }

    user.seatApplications.push({
      language,
      goal: String(goal).trim().slice(0, 500),
      availability: String(availability).trim().slice(0, 200),
      contactPreference: String(contactPreference).trim().slice(0, 120),
      status: 'pending',
      submittedAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      message: 'Message sent to our team. They will get back to you soon.',
      application: user.seatApplications[user.seatApplications.length - 1],
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(toPublicUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List users for staff role visibility. Only Web Developer can update roles.
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const requester = await User.findById(req.userId).select('role');
    const requesterRole = normalizeRole(requester?.role);

    if (!requester || requesterRole === ROLES.learner) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }

    const users = await User.find({})
      .select('name email avatarUrl role languageSelected enrolledPathways learnerProfile seatApplications createdAt')
      .sort({ createdAt: -1 });

    res.json({
      courseSeatLimit: config.COURSE_SEAT_LIMIT,
      courseSeatLimits: config.COURSE_SEAT_LIMITS,
      roles: ROLE_VALUES.map(role => ({
        value: role,
        label: ROLE_LABELS[role],
        permissions: getRolePermissions(role),
      })),
      users: users.map(toPublicUser),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Only Web Developer can promote/demote team members.
router.patch('/users/:id/role', authMiddleware, requirePermission('manage_roles'), async (req, res) => {
  try {
    const { role } = req.body;
    if (!ROLE_VALUES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = normalizeRole(role);
    await user.save();

    res.json({
      message: 'Role updated',
      user: toPublicUser(user),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
