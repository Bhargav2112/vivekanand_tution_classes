const express = require('express');
const {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  sendNotification
} = require('../controllers/push.controller');

const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/vapid-public-key', getVapidPublicKey);
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.post('/send', protect, authorize('Super Admin', 'Admin'), sendNotification);

module.exports = router;
