const express = require('express');
const {
  createTestimonial,
  getTestimonials,
  getTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonial.controller');

const Testimonial = require('../models/Testimonial.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Testimonial), getTestimonials)
  .post(protect, authorize('Super Admin', 'Admin'), createTestimonial);

router.route('/:id')
  .get(getTestimonial)
  .put(protect, authorize('Super Admin', 'Admin'), updateTestimonial)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteTestimonial);

module.exports = router;