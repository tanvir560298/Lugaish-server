import mongoose from 'mongoose';
import config from '../src/config.js';
import { User } from '../src/models/User.js';
import { ROLES } from '../src/utils/roles.js';

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error('Usage: npm run make:web-developer -- user@example.com');
  process.exit(1);
}

try {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found for ${email}. Sign in once first, then rerun this command.`);
    process.exitCode = 1;
  } else {
    user.role = ROLES.webDeveloper;
    await user.save();
    console.log(`${email} is now Web Developer.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.connection.close();
}
