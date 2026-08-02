const express = require('express');
const {
  createAdmission,
  getAdmissions,
  getAdmission,
  updateAdmission,
  deleteAdmission
} = require('../controllers/admission.controller');

const Admission = require('../models/Admission.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Admission, { path: 'course', select: 'name' }), getAdmissions)
  .post(createAdmission);

router.route('/:id')
  .get(getAdmission)
  .put(protect, authorize('Super Admin', 'Admin'), updateAdmission)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteAdmission);

module.exports = router;