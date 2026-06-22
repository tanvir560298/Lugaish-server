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

const app = express();

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend running', apiBase: '/api' });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Backend running on http://localhost:${config.PORT}`);
});
