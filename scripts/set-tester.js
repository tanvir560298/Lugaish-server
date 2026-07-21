import mongoose from 'mongoose';
import config from '../src/config.js';
import { User } from '../src/models/User.js';
import { ROLES } from '../src/utils/roles.js';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error('Usage: npm run make:tester -- user@example.com');
try {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const user = await User.findOne({ email });
  if (!user) throw new Error(`No user found for ${email}. Sign in once first.`);
  user.role = ROLES.tester;
  await user.save();
  console.log(`${email} is now a sandbox Tester.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.connection.close();
}
