const mongoose = require('mongoose');

const WorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['individuel', 'collectif'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  assignments: [
    {
      assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      groupName: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model('Work', WorkSchema);
