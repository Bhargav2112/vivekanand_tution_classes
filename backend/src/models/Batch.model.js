const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);