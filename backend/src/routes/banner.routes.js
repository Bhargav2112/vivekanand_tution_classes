const express = require('express');
const {
  createBanner,
  getBanners,
  getBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/banner.controller');
const Banner = require('../models/Banner.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router
  .route('/')
  .get(advancedResults(Banner), getBanners)
  .post(protect, createBanner);

router
  .route('/:id')
  .get(getBanner)
  .put(protect, updateBanner)
  .delete(protect, deleteBanner);

module.exports = router;
