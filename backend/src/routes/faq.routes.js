const express = require('express');
const {
  createFAQ,
  getFAQs,
  getFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faq.controller');

const FAQ = require('../models/FAQ.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(FAQ), getFAQs)
  .post(protect, authorize('Super Admin', 'Admin'), createFAQ);

router.route('/:id')
  .get(getFAQ)
  .put(protect, authorize('Super Admin', 'Admin'), updateFAQ)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteFAQ);

module.exports = router;