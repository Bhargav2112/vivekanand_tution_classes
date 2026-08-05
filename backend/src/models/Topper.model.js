const mongoose = require('mongoose');

const topperSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo_url: { type: String, required: true },
  rank: { type: String }, // e.g. "1st in Gujarat", "School Rank 1"
  percentage: { type: String }, // e.g. "99.99 PR", "95%"
  standard: { type: String, required: true }, // e.g. "Std 10", "Navodaya"
  achievement: { type: String }, // A short quote or detail
  year: { type: String, required: true },
  
  order: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Topper', topperSchema);
