const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/gasaunivers';
  await mongoose.connect(uri);
  console.log('Connected to Mongo');

  const email = process.env.SEED_EMAIL || 'formateur.demo@gmail.com';
  const password = process.env.SEED_PASSWORD || 'Demo2026!';
  const name = process.env.SEED_NAME || 'Formateur Demo';

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('User already exists:', existing.email);
    await mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: email.toLowerCase(), password: hash, role: 'formateur' });
  console.log('Created user:', { id: user._id.toString(), email: user.email, role: user.role });
  await mongoose.disconnect();
}

run().catch(async (e) => { console.error(e); try { await mongoose.disconnect(); } catch(_){} process.exit(1); });
