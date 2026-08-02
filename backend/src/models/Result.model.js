const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  photo_url: { type: String, default: '' },
  exam: { type: String, required: true },
  year: { type: String, default: '' },
  marks: { type: Number },
  rank: { type: Number },
  percentage: { type: Number, max: [100, 'ટકાવારી ક્યારેય ૧૦૦ થી વધુ ન હોઈ શકે'] },
  certificate_url: { type: String, default: '' },
  display_on_website: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);