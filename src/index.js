import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';

// Import routes
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import lessonRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';
import quizRoutes from './routes/quiz.js';
import interviewRoutes from './routes/interviews.js';
import emailRoutes from './routes/email.js';

const app = express();

app.disable('x-powered-by');
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
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), geolocation=()',
  });
  next();
});
app.use(express.json({ limit: '64kb' }));

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

function createRateLimiter({ windowMs, maxRequests }) {
  const clients = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const current = clients.get(key);
    const entry = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    entry.count += 1;
    clients.set(key, entry);
    res.set('RateLimit-Remaining', String(Math.max(maxRequests - entry.count, 0)));

    if (entry.count > maxRequests) {
      const retryAfterSeconds = Math.max(Math.ceil((entry.resetAt - now) / 1000), 1);
      res.set('Retry-After', String(retryAfterSeconds));
      return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
    }

    // Keep the in-memory limiter bounded on long-running instances.
    if (clients.size > 5000) {
      for (const [clientKey, value] of clients) {
        if (value.resetAt <= now) clients.delete(clientKey);
      }
    }
    return next();
  };
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
app.use('/api/auth', createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 120 }), requireDatabase, authRoutes);
app.use('/api/courses', requireDatabase, courseRoutes);
app.use('/api/lessons', requireDatabase, lessonRoutes);
app.use('/api/progress', requireDatabase, progressRoutes);
app.use('/api/quiz', createRateLimiter({ windowMs: 60 * 1000, maxRequests: 30 }), requireDatabase, quizRoutes);
app.use('/api/interviews', requireDatabase, interviewRoutes);
app.use('/api/email', requireDatabase, emailRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Backend running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    apiBase: '/api',
  });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Backend running on http://localhost:${config.PORT}`);
});
