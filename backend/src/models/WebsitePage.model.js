const mongoose = require('mongoose');

const websitepageSchema = new mongoose.Schema({
  page_name: { type: String, required: true },
  section: { type: String },
  title: { type: String, required: true },
  image_url: { type: String },
  content: { type: String },
  display_order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('WebsitePage', websitepageSchema);