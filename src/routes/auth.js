import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import config from '../config.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, languageSelected } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      languageSelected: languageSelected || 'english',
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: user._id, name, email, languageSelected: user.languageSelected },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email, languageSelected: user.languageSelected },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
