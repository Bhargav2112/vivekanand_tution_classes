const express = require('express');
const {
  createShortVideo,
  getShortVideos,
  getShortVideo,
  updateShortVideo,
  deleteShortVideo
} = require('../controllers/shortVideo.controller');
const ShortVideo = require('../models/ShortVideo.model');
const advancedResults = require('../middlewares/advancedResults.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(ShortVideo), getShortVideos)
  .post(protect, authorize('admin', 'superadmin'), createShortVideo);

router
  .route('/:id')
  .get(getShortVideo)
  .put(protect, authorize('admin', 'superadmin'), updateShortVideo)
  .delete(protect, authorize('admin', 'superadmin'), deleteShortVideo);

module.exports = router;
