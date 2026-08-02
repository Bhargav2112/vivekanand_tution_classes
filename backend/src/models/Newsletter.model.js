const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  title: { type: String, required: false }, // Placeholder field
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', newsletterSchema);