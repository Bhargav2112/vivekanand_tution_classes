const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  parent_name: { type: String, default: '' },
  photo_url: { type: String, default: '' },
  course: { type: String, default: '' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  review: { type: String, required: true },
  status: { type: String, default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);