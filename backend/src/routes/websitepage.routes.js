const express = require('express');
const {
  createWebsitePage,
  getWebsitePages,
  getWebsitePage,
  updateWebsitePage,
  deleteWebsitePage
} = require('../controllers/websitepage.controller');

const WebsitePage = require('../models/WebsitePage.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(WebsitePage), getWebsitePages)
  .post(protect, authorize('Super Admin', 'Admin'), createWebsitePage);

router.route('/:id')
  .get(getWebsitePage)
  .put(protect, authorize('Super Admin', 'Admin'), updateWebsitePage)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteWebsitePage);

module.exports = router;