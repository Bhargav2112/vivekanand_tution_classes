const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short: { type: String, default: '' },
  badge: { type: String, default: '' },
  description: { type: String, default: '' },
  features: [{ type: String }],
  duration: { type: String, default: '' },
  classes: { type: String, default: 'અઠવાડિયામાં 6 દિવસ' },
  grade: { type: String, default: '' },
  eligibility: { type: String, default: '' },
  fees: { type: Number, default: 0 },
  image_url: { type: String, default: '' },
  icon: { type: String, default: '' },
  display_order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  category: { type: mongoose.Schema.ObjectId, ref: 'CourseCategory' },
  has_weekly_test: { type: Boolean, default: true },
  has_study_material: { type: Boolean, default: true },
  has_personal_guidance: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);