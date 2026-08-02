const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  course: { type: mongoose.Schema.Types.Mixed, required: false },
  mobile: { type: String, required: true },
  parent_name: { type: String },
  parent_mobile: { type: String },
  address: { type: String },
  photo_url: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  payment_status: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  admission_date: { type: Date, default: Date.now },
  remarks: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);