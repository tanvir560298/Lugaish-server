import crypto from 'crypto';
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Certificate } from '../models/Certificate.js';
import { User } from '../models/User.js';
import { calculateDailyStreak, getCompletedCourseDays, getEligibleMilestones, getLearningActivityDates } from '../services/learningAchievements.js';

const router = express.Router();

function publicCertificate(certificate) {
  return {
    certificateCode: certificate.certificateCode,
    recipientName: certificate.recipientName,
    language: certificate.language,
    milestone: certificate.milestone,
    issuedAt: certificate.issuedAt,
  };
}

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!user.referralCode) {
      user.referralCode = `LUG${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
      await user.save();
    }

    const languages = Array.isArray(user.enrolledPathways) ? user.enrolledPathways : [];
    const [courseProgress, certificates, referralCount, activityDates] = await Promise.all([
      Promise.all(languages.map(async language => {
        const completedDays = await getCompletedCourseDays(user, language);
        return { language, completedDays, eligibleMilestones: getEligibleMilestones(completedDays) };
      })),
      Certificate.find({ userId: user._id }).sort({ milestone: 1 }).lean(),
      User.countDocuments({ referredBy: user._id }),
      getLearningActivityDates(user._id, languages),
    ]);

    res.json({
      courseProgress,
      certificates: certificates.map(publicCertificate),
      referralCode: user.referralCode || '',
      referralCount,
      isPremium: Boolean(user.isPremium),
      currentStreak: calculateDailyStreak(activityDates),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/certificates/:language/:milestone', authMiddleware, async (req, res) => {
  try {
    const language = String(req.params.language || '').toLowerCase();
    const milestone = Number(req.params.milestone);
    if (!['english', 'arabic'].includes(language) || ![7, 14, 21, 30].includes(milestone)) {
      return res.status(400).json({ error: 'Invalid certificate milestone' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!(user.enrolledPathways ?? []).includes(language)) return res.status(403).json({ error: 'Not enrolled in this language' });

    const completedDays = await getCompletedCourseDays(user, language);
    if (!getEligibleMilestones(completedDays).includes(milestone)) {
      return res.status(409).json({ error: `Complete Days 1–${milestone} to unlock this certificate.` });
    }

    const existing = await Certificate.findOne({ userId: user._id, language, milestone });
    if (existing) return res.json({ certificate: publicCertificate(existing), alreadyIssued: true });

    const certificate = await Certificate.create({
      userId: user._id,
      language,
      milestone,
      recipientName: String(user.name || 'Learner').trim().slice(0, 100),
      certificateCode: `LUG-${language.slice(0, 2).toUpperCase()}-${milestone}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`,
    });
    return res.status(201).json({ certificate: publicCertificate(certificate), alreadyIssued: false });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ error: 'Certificate already issued. Refresh your profile.' });
    return res.status(500).json({ error: error.message });
  }
});

router.get('/certificates/verify/:code', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateCode: String(req.params.code || '').toUpperCase() }).lean();
    if (!certificate) return res.status(404).json({ valid: false, error: 'Certificate not found' });
    return res.json({ valid: true, certificate: publicCertificate(certificate) });
  } catch (error) {
    return res.status(500).json({ valid: false, error: 'Certificate verification unavailable' });
  }
});

export default router;
