const mongoose = require('mongoose');

const bookCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image_url: { type: String },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('BookCategory', bookCategorySchema);
