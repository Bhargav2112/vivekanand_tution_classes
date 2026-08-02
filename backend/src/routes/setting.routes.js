const express = require('express');
const {
  createSetting,
  getSettings,
  getSetting,
  updateSetting,
  deleteSetting
} = require('../controllers/setting.controller');

const Setting = require('../models/Setting.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Setting), getSettings)
  .post(protect, authorize('Super Admin', 'Admin'), createSetting);

router.route('/:id')
  .get(getSetting)
  .put(protect, authorize('Super Admin', 'Admin'), updateSetting)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteSetting);

module.exports = router;