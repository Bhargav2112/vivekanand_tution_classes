const express = require('express');
const {
  createNotice,
  getNotices,
  getNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/notice.controller');

const Notice = require('../models/Notice.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Notice), getNotices)
  .post(protect, authorize('Super Admin', 'Admin'), createNotice);

router.route('/:id')
  .get(getNotice)
  .put(protect, authorize('Super Admin', 'Admin'), updateNotice)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteNotice);

module.exports = router;