const express = require('express');
const {
  getChannel,
  getVideos,
  getShorts,
  getLiveVideos,
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
router.get('/live', getLiveVideos);

// Webhook route (must accept GET for challenge, POST for data)
router.route('/webhook')
  .get(youtubeWebhook)
  .post(youtubeWebhook);

// Admin protected routes
router.post('/sync', protect, authorize('Super Admin', 'Admin'), triggerSync);
router.get('/logs', protect, authorize('Super Admin', 'Admin'), getSyncLogs);

module.exports = router;
