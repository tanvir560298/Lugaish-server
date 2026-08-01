import mongoose from 'mongoose';
import config from '../src/config.js';
import { sendDailyTaskReminders } from '../src/services/dailyTaskReminder.js';

try {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const result = await sendDailyTaskReminders();
  console.log(JSON.stringify(result));
  if (result.failed) process.exitCode = 1;
} catch (error) {
  console.error(error.message || error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
