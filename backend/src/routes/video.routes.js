const express = require('express');
const {
  createVideo,
  getVideos,
  getVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/video.controller');

const Video = require('../models/Video.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Video), getVideos)
  .post(protect, authorize('Super Admin', 'Admin'), createVideo);

router.route('/:id')
  .get(getVideo)
  .put(protect, authorize('Super Admin', 'Admin'), updateVideo)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteVideo);

module.exports = router;