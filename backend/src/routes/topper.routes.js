const express = require('express');
const {
  createTopper,
  getToppers,
  getTopper,
  updateTopper,
  deleteTopper
} = require('../controllers/topper.controller');

const Topper = require('../models/Topper.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Topper), getToppers)
  .post(protect, authorize('Super Admin', 'Admin'), createTopper);

router.route('/:id')
  .get(getTopper)
  .put(protect, authorize('Super Admin', 'Admin'), updateTopper)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteTopper);

module.exports = router;
