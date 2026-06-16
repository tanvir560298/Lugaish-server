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

// MongoDB connection
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quiz', quizRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend running', apiBase: '/api' });
});

// Start server
app.listen(config.PORT, () => {
  console.log(`Backend running on http://localhost:${config.PORT}`);
});
