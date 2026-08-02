const mongoose = require('mongoose');

const youtubeChannelSchema = new mongoose.Schema({
  channelId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  customUrl: { type: String, default: '' },
  publishedAt: { type: Date },
  thumbnailUrl: { type: String, default: '' },
  bannerUrl: { type: String, default: '' },
  viewCount: { type: String, default: '0' },
  subscriberCount: { type: String, default: '0' },
  videoCount: { type: String, default: '0' },
  uploadsPlaylistId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('YoutubeChannel', youtubeChannelSchema);
