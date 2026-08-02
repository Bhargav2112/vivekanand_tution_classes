const express = require('express');
const {
  createShortVideo,
  getShortVideos,
  getShortVideo,
  updateShortVideo,
  deleteShortVideo
} = require('../controllers/shortVideo.controller');
const ShortVideo = require('../models/ShortVideo.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(ShortVideo), getShortVideos)
  .post(protect, authorize('Super Admin', 'Admin'), createShortVideo);

router
  .route('/:id')
  .get(getShortVideo)
  .put(protect, authorize('Super Admin', 'Admin'), updateShortVideo)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteShortVideo);

module.exports = router;
