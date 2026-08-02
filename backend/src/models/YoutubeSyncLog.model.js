const mongoose = require('mongoose');

const youtubeSyncLogSchema = new mongoose.Schema({
  syncType: { type: String, enum: ['manual', 'auto', 'webhook'], required: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  message: { type: String, default: '' },
  videosAdded: { type: Number, default: 0 },
  shortsAdded: { type: Number, default: 0 },
  totalProcessed: { type: Number, default: 0 },
  startedAt: { type: Date, required: true },
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('YoutubeSyncLog', youtubeSyncLogSchema);
