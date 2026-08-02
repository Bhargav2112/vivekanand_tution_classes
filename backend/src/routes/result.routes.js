const express = require('express');
const {
  createResult,
  getResults,
  getResult,
  updateResult,
  deleteResult
} = require('../controllers/result.controller');

const Result = require('../models/Result.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Result), getResults)
  .post(protect, authorize('Super Admin', 'Admin'), createResult);

router.route('/:id')
  .get(getResult)
  .put(protect, authorize('Super Admin', 'Admin'), updateResult)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteResult);

module.exports = router;