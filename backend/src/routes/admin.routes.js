const express = require('express');
const {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/admin.controller');

const Admin = require('../models/Admin.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Admin), getAdmins)
  .post(protect, authorize('Super Admin', 'Admin'), createAdmin);

router.route('/:id')
  .get(getAdmin)
  .put(protect, authorize('Super Admin', 'Admin'), updateAdmin)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteAdmin);

module.exports = router;