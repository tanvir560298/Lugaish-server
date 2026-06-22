import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/lugaish',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:4174',
};
