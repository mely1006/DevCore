const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['directeur','formateur','etudiant'], default: 'directeur' },
  phone: { type: String },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
