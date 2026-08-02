const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: false }, // Placeholder field
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);