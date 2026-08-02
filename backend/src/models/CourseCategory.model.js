const mongoose = require('mongoose');

const coursecategorySchema = new mongoose.Schema({
  title: { type: String, required: false }, // Placeholder field
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CourseCategory', coursecategorySchema);