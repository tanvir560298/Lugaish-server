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
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:4174',
};
