const express = require('express');
const {
  createSEO,
  getSEOs,
  getSEO,
  updateSEO,
  deleteSEO
} = require('../controllers/seo.controller');

const SEO = require('../models/SEO.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(SEO), getSEOs)
  .post(protect, authorize('Super Admin', 'Admin'), createSEO);

router.route('/:id')
  .get(getSEO)
  .put(protect, authorize('Super Admin', 'Admin'), updateSEO)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteSEO);

module.exports = router;