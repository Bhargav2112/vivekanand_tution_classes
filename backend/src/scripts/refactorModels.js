const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../models');

const bq = String.fromCharCode(96);
const sq = String.fromCharCode(39);

// Schemas specifically aligned with the frontend data
const schemas = {
  course: `const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short: { type: String, required: true },
  badge: { type: String },
  description: { type: String, required: true },
  features: [{ type: String }],
  duration: { type: String, required: true },
  classes: { type: String, required: true },
  grade: { type: String },
  icon: { type: String },
  category: { type: mongoose.Schema.ObjectId, ref: 'CourseCategory' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);`,

  batch: `const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  desc: { type: String, required: true },
  icon: { type: String },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Batch', batchSchema);`,

  faq: `const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);`,

  result: `const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  percentage: { type: String, required: true },
  year: { type: String, required: true },
  image: { type: String },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);`,

  testimonial: `const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Student' },
  content: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);`,

  admission: `const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.ObjectId, ref: 'Course', required: true },
  batch: { type: mongoose.Schema.ObjectId, ref: 'Batch' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Partial', 'Paid'], default: 'Unpaid' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);`
};

Object.keys(schemas).forEach(modelName => {
  const filePath = path.join(modelsDir, modelName + '.model.js');
  fs.writeFileSync(filePath, schemas[modelName]);
});

console.log('Successfully refactored key models.');
