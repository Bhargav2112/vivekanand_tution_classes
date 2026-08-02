const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  institute_name: { type: String, required: true },
  phone: { type: String },
  whatsapp: { type: String },
  email: { type: String },
  address: { type: String },
  map_embed: { type: String },
  timing: { type: String },
  footer_text: { type: String },
  meta_title: { type: String },
  meta_description: { type: String },
  google_analytics: { type: String },
  social_links: {
    instagram: { type: String },
    youtube: { type: String },
    facebook: { type: String }
  },
  logo_url: { type: String },
  dark_logo_url: { type: String },
  favicon_url: { type: String },
  tagline: { type: String },
  hero_banner_url: { type: String },
  classroom_img_url: { type: String },
  about_banner_url: { type: String },
  founder_img_url: { type: String },
  
  // Statistics fields
  stats_students_value: { type: Number, default: 5000 },
  stats_students_suffix: { type: String, default: "+" },
  stats_students_label: { type: String, default: "વિદ્યાર્થીઓ" },
  stats_results_value: { type: Number, default: 98 },
  stats_results_suffix: { type: String, default: "%" },
  stats_results_label: { type: String, default: "પરિણામ" },
  stats_experience_value: { type: Number, default: 15 },
  stats_experience_suffix: { type: String, default: "+" },
  stats_experience_label: { type: String, default: "વર્ષનો અનુભવ" },
  stats_merit_value: { type: Number, default: 500 },
  stats_merit_suffix: { type: String, default: "+" },
  stats_merit_label: { type: String, default: "મેરિટ વિદ્યાર્થીઓ" },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);