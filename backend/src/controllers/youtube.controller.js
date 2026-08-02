const YoutubeChannel = require('../models/YoutubeChannel.model');
const YoutubeVideo = require('../models/YoutubeVideo.model');
const YoutubeSyncLog = require('../models/YoutubeSyncLog.model');
const youtubeService = require('../services/youtube.service');

// @desc    Get channel details
// @route   GET /api/v1/youtube/channel
// @access  Public
exports.getChannel = async (req, res) => {
  try {
    const channel = await YoutubeChannel.findOne();
    if (!channel) {
      return res.status(404).json({ success: false, message: 'Channel data not synced yet' });
    }
    res.status(200).json({ success: true, data: channel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all youtube videos
// @route   GET /api/v1/youtube/videos
// @access  Public
exports.getVideos = async (req, res) => {
  try {
    const videos = await YoutubeVideo.find({ type: 'video', isActive: true })
      .sort({ publishedAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all youtube shorts
// @route   GET /api/v1/youtube/shorts
// @access  Public
exports.getShorts = async (req, res) => {
  try {
    const shorts = await YoutubeVideo.find({ type: 'short', isActive: true })
      .sort({ publishedAt: -1 });
    res.status(200).json({ success: true, count: shorts.length, data: shorts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger a manual sync
// @route   POST /api/v1/youtube/sync
// @access  Private/Admin
exports.triggerSync = async (req, res) => {
  try {
    const log = await youtubeService.performSync('manual');
    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get sync logs (for admin panel)
// @route   GET /api/v1/youtube/logs
// @access  Private/Admin
exports.getSyncLogs = async (req, res) => {
  try {
    const logs = await YoutubeSyncLog.find().sort({ startedAt: -1 }).limit(20);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    WebSub Hub Challenge & Push Notifications
// @route   GET/POST /api/v1/youtube/webhook
// @access  Public (from YouTube PubSubHubbub)
exports.youtubeWebhook = async (req, res) => {
  // Handle WebSub verification challenge (GET)
  if (req.method === 'GET') {
    const challenge = req.query['hub.challenge'];
    if (challenge) {
      // YouTube is verifying our subscription
      return res.status(200).send(challenge);
    }
    return res.status(400).send('Invalid request');
  }

  // Handle WebSub push notification (POST)
  if (req.method === 'POST') {
    try {
      // A new video was uploaded or updated. The push body contains Atom XML, 
      // but we don't need to parse it because we can just trigger our sync logic!
      // This is simpler and more robust because our sync logic handles pagination, 
      // updating, and short detection gracefully.
      
      // We run sync in the background so we can respond 200 OK to YouTube immediately
      youtubeService.performSync('webhook').catch(err => console.error('Webhook sync error:', err));
      
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(500).send('Error');
    }
  }
};
