const express = require('express');
const {
  createGallery,
  getGallerys,
  getGallery,
  updateGallery,
  deleteGallery
} = require('../controllers/gallery.controller');

const Gallery = require('../models/Gallery.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Gallery), getGallerys)
  .post(protect, authorize('Super Admin', 'Admin'), createGallery);

router.route('/:id')
  .get(getGallery)
  .put(protect, authorize('Super Admin', 'Admin'), updateGallery)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteGallery);

module.exports = router;