const mongoose = require('mongoose');

const shortVideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  youtube_url: { type: String, required: true },
  thumbnail_url: { type: String, default: '' },
  category: { type: String, default: '' },
  description: { type: String, default: '' },
  display_order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ShortVideo', shortVideoSchema);
