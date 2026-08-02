const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo_url: { type: String },
  course: { type: mongoose.Schema.Types.Mixed },
  batch: { type: mongoose.Schema.ObjectId, ref: 'Batch' },
  roll_no: { type: String },
  mobile: { type: String },
  parent_name: { type: String },
  parent_mobile: { type: String },
  address: { type: String },
  admission_status: { type: String, enum: ['active', 'inactive', 'graduated'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);