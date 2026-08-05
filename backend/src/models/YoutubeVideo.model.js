const mongoose = require('mongoose');

const youtubeVideoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  type: { type: String, enum: ['video', 'short'], required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  publishedAt: { type: Date, required: true, index: true },
  channelId: { type: String, required: true },
  duration: { type: String, default: '' },
  viewCount: { type: String, default: '0' },
  likeCount: { type: String, default: '0' },
  commentCount: { type: String, default: '0' },
  embedUrl: { type: String, default: '' },
  watchUrl: { type: String, default: '' },
  liveBroadcastContent: { type: String, enum: ['none', 'upcoming', 'live', 'completed'], default: 'none' },
  scheduledStartTime: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('YoutubeVideo', youtubeVideoSchema);
