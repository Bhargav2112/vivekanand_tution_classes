const express = require('express');
const {
  createBatch,
  getBatchs,
  getBatch,
  updateBatch,
  deleteBatch
} = require('../controllers/batch.controller');

const Batch = require('../models/Batch.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Batch), getBatchs)
  .post(protect, authorize('Super Admin', 'Admin'), createBatch);

router.route('/:id')
  .get(getBatch)
  .put(protect, authorize('Super Admin', 'Admin'), updateBatch)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteBatch);

module.exports = router;