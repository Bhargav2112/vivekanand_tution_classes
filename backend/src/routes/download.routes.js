const express = require('express');
const {
  createDownload,
  getDownloads,
  getDownload,
  updateDownload,
  deleteDownload
} = require('../controllers/download.controller');

const Download = require('../models/Download.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Download), getDownloads)
  .post(protect, authorize('Super Admin', 'Admin'), createDownload);

router.route('/:id')
  .get(getDownload)
  .put(protect, authorize('Super Admin', 'Admin'), updateDownload)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteDownload);

module.exports = router;