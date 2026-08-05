const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['normal', 'scrolling', 'popup', 'ticker'], default: 'normal' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  color: { type: String, default: '#000000' },
  link: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  order: { type: Number, default: 0 },
  autoExpire: { type: Boolean, default: false },
  animationSpeed: { type: Number, default: 50 }, // css animation duration in seconds
  expiry_date: { type: Date },
  attachment_url: { type: String },
  pinned: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);