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

const app = express();

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
app.use(express.json());

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' });
  }

  return next();
}

// MongoDB connection
mongoose
  .connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
app.use('/api/auth', requireDatabase, authRoutes);
app.use('/api/courses', requireDatabase, courseRoutes);
app.use('/api/lessons', requireDatabase, lessonRoutes);
app.use('/api/progress', requireDatabase, progressRoutes);
app.use('/api/quiz', requireDatabase, quizRoutes);
app.use('/api/interviews', requireDatabase, interviewRoutes);

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
