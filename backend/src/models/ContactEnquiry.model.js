const mongoose = require('mongoose');

const contactenquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  subject: { type: String },
  message: { type: String },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ContactEnquiry', contactenquirySchema);