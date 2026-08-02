const express = require('express');
const {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacher.controller');

const Teacher = require('../models/Teacher.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Teacher), getTeachers)
  .post(protect, authorize('Super Admin', 'Admin'), createTeacher);

router.route('/:id')
  .get(getTeacher)
  .put(protect, authorize('Super Admin', 'Admin'), updateTeacher)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteTeacher);

module.exports = router;