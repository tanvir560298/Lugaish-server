import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';
import { validateProductionConfig } from './utils/validateConfig.js';

// Import routes
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';
import quizRoutes from './routes/quiz.js';
import interviewRoutes from './routes/interviews.js';
import emailRoutes from './routes/email.js';
import achievementRoutes from './routes/achievements.js';

const app = express();
validateProductionConfig(config);
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = new Set(config.CORS_ORIGINS);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=(self)',
    'Cross-Origin-Resource-Policy': 'same-site',
  });
  next();
});
app.use(express.json({ limit: '256kb' }));

app.use((error, req, res, next) => {
  if (error?.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  return next(error);
});

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }

  return next();
}

const DATABASE_RETRY_DELAY_MS = 5000;

async function connectDatabase() {
  try {
    await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}. Retrying...`);
    setTimeout(connectDatabase, DATABASE_RETRY_DELAY_MS);
  }
}

connectDatabase();

// Routes
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/courses', requireDatabase, courseRoutes);
app.use('/api/lessons', requireDatabase, lessonRoutes);
app.use('/api/progress', requireDatabase, progressRoutes);
app.use('/api/quiz', requireDatabase, quizRoutes);
app.use('/api/interviews', requireDatabase, interviewRoutes);
app.use('/api/email', requireDatabase, emailRoutes);
app.use('/api/achievements', requireDatabase, achievementRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Backend running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    apiBase: '/api',
    scheduleVersion: 'global-dhaka-day4-v4',
  });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error?.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large' });
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  console.error(`Unhandled request error: ${error?.message || 'Unknown error'}`);
  return res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Backend running on http://localhost:${config.PORT}`);
});
