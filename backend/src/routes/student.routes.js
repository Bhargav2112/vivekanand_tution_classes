const express = require('express');
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/student.controller');

const Student = require('../models/Student.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Student), getStudents)
  .post(protect, authorize('Super Admin', 'Admin'), createStudent);

router.route('/:id')
  .get(getStudent)
  .put(protect, authorize('Super Admin', 'Admin'), updateStudent)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteStudent);

module.exports = router;