import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lugaish',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  WEB_DEVELOPER_EMAILS: process.env.WEB_DEVELOPER_EMAILS || 'tahmadium@gmail.com',
  COURSE_SEAT_LIMIT: Number(process.env.COURSE_SEAT_LIMIT || 100),
  COURSE_SEAT_LIMITS: {
    english: Number(process.env.COURSE_SEAT_LIMIT_ENGLISH || 110),
    arabic: Number(process.env.COURSE_SEAT_LIMIT_ARABIC || 55),
  },
  INTERVIEW_ROOM_URLS: process.env.INTERVIEW_ROOM_URLS || [
    process.env.INTERVIEW_ROOM_1_URL || 'https://meet.google.com/',
    process.env.INTERVIEW_ROOM_2_URL || 'https://meet.google.com/',
    process.env.INTERVIEW_ROOM_3_URL || 'https://meet.google.com/',
    process.env.INTERVIEW_ROOM_4_URL || 'https://meet.google.com/',
  ].join(','),
  INTERVIEW_ROOM_CAPACITIES: process.env.INTERVIEW_ROOM_CAPACITIES || '25,25,25,25',
  INTERVIEW_SUPPORT_EMAIL: process.env.INTERVIEW_SUPPORT_EMAIL || 'lugaish2026@gmail.com',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4174',
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID || '',
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET || '',
  GMAIL_REDIRECT_URI: process.env.GMAIL_REDIRECT_URI || 'http://localhost:5001/api/email/oauth/callback',
  GMAIL_SENDER_EMAIL: (process.env.GMAIL_SENDER_EMAIL || 'tahmadium@gmail.com').toLowerCase(),
  GMAIL_TOKEN_ENCRYPTION_KEY: process.env.GMAIL_TOKEN_ENCRYPTION_KEY || '',
  CORS_ORIGINS: [
    'https://lugaish.vercel.app',
    'http://localhost:4174',
    'http://127.0.0.1:4174',
    'http://localhost:4175',
    'http://127.0.0.1:4175',
    ...(process.env.CORS_ORIGIN || '')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean),
  ],
};
