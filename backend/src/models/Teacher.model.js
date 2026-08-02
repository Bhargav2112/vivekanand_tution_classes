const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo_url: { type: String, default: '' },
  subject: { type: String, required: true },
  qualification: { type: String, default: '' },
  experience: { type: String, default: '' },
  description: { type: String, default: '' },
  display_order: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);