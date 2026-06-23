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
  config.WEB_DEVELOPER_EMAILS
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
);

function normalizePathways(pathways, fallback = 'english') {
  const valid = new Set(['english', 'arabic']);
  const normalized = Array.isArray(pathways)
    ? pathways.filter(pathway => valid.has(pathway))
    : [];

  if (valid.has(fallback)) normalized.unshift(fallback);
  return [...new Set(normalized)];
}

function toPublicUser(user) {
  const role = normalizeRole(user.role);

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    languageSelected: user.languageSelected,
    enrolledPathways: normalizePathways(user.enrolledPathways, user.languageSelected),
    role,
    roleLabel: ROLE_LABELS[role],
    permissions: getRolePermissions(role),
    avatarUrl: user.avatarUrl,
    learnerProfile: user.learnerProfile ?? {},
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
        enrolledPathways: [selectedLanguage],
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
      .select('name email avatarUrl role languageSelected enrolledPathways learnerProfile createdAt')
      .sort({ createdAt: -1 });

    res.json({
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
