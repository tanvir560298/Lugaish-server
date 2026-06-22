import express from 'express';
import jwt from 'jsonwebtoken';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { User } from '../models/User.js';
import config from '../config.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

if (!getApps().length) {
  initializeApp({
    projectId: config.FIREBASE_PROJECT_ID || undefined,
  });
}

function normalizePathways(pathways, fallback = 'english') {
  const valid = new Set(['english', 'arabic']);
  const normalized = Array.isArray(pathways)
    ? pathways.filter(pathway => valid.has(pathway))
    : [];

  if (valid.has(fallback)) normalized.unshift(fallback);
  return [...new Set(normalized)];
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    languageSelected: user.languageSelected,
    enrolledPathways: normalizePathways(user.enrolledPathways, user.languageSelected),
    role: user.role ?? 'user',
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
        languageSelected: selectedLanguage,
        enrolledPathways: [selectedLanguage],
        learnerProfile: cleanedProfile,
      });
    } else {
      user.authProvider = 'firebase';
      user.firebaseUid = user.firebaseUid || firebaseUser.uid;
      user.avatarUrl = firebaseUser.picture || user.avatarUrl;
      user.name = preferredName || user.name;
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

export default router;
