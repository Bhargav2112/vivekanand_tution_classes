const express = require('express');
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/course.controller');

const Course = require('../models/Course.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Course), getCourses)
  .post(protect, authorize('Super Admin', 'Admin'), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('Super Admin', 'Admin'), updateCourse)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteCourse);

module.exports = router;