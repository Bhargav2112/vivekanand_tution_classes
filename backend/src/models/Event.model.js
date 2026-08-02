const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  banner_url: { type: String },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  registration_link: { type: String },
  status: { type: String, enum: ['upcoming', 'past', 'cancelled'], default: 'upcoming' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);