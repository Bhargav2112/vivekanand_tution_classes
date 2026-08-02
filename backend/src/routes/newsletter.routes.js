const express = require('express');
const {
  createNewsletter,
  getNewsletters,
  getNewsletter,
  updateNewsletter,
  deleteNewsletter
} = require('../controllers/newsletter.controller');

const Newsletter = require('../models/Newsletter.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Newsletter), getNewsletters)
  .post(protect, authorize('Super Admin', 'Admin'), createNewsletter);

router.route('/:id')
  .get(getNewsletter)
  .put(protect, authorize('Super Admin', 'Admin'), updateNewsletter)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteNewsletter);

module.exports = router;