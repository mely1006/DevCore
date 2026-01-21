const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Promotion', PromotionSchema);
