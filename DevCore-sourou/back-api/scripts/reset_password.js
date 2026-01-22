const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/gasaunivers';
  await mongoose.connect(uri);
  console.log('Connected to Mongo');

  const email = process.env.RESET_EMAIL;
  const password = process.env.RESET_PASSWORD;

  if (!email || !password) {
    console.error('Please set RESET_EMAIL and RESET_PASSWORD in environment');
    await mongoose.disconnect();
    process.exit(1);
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    console.error('User not found:', email);
    await mongoose.disconnect();
    process.exit(1);
  }

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  console.log('Password updated for', user.email);
  await mongoose.disconnect();
}

run().catch(async (e) => { console.error(e); try { await mongoose.disconnect(); } catch(_){} process.exit(1); });
