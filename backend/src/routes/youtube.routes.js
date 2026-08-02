const express = require('express');
const {
  getChannel,
  getVideos,
  getShorts,
  triggerSync,
  getSyncLogs,
  youtubeWebhook
} = require('../controllers/youtube.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/channel', getChannel);
router.get('/videos', getVideos);
router.get('/shorts', getShorts);

// Webhook route (must accept GET for challenge, POST for data)
router.route('/webhook')
  .get(youtubeWebhook)
  .post(youtubeWebhook);

// Admin protected routes
router.post('/sync', protect, authorize('Admin'), triggerSync);
router.get('/logs', protect, authorize('Admin'), getSyncLogs);

module.exports = router;
