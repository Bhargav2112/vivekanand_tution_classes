const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'BookCategory', required: true },
  price: { type: Number, required: true },
  discount_price: { type: Number },
  author: { type: String },
  publisher: { type: String },
  language: { type: String, enum: ['Gujarati', 'English', 'Hindi'], default: 'Gujarati' },
  class: { type: String }, // e.g. "Std 10", "Navodaya"
  subject: { type: String },
  stock: { type: Number, default: 0 },
  isbn: { type: String },
  thumbnail_url: { type: String },
  gallery_urls: [{ type: String }],
  pdf_preview_url: { type: String },
  
  // Flags
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  
  // SEO
  meta_title: { type: String },
  meta_description: { type: String },
  
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
