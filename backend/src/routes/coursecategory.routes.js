const express = require('express');
const {
  createCourseCategory,
  getCourseCategorys,
  getCourseCategory,
  updateCourseCategory,
  deleteCourseCategory
} = require('../controllers/coursecategory.controller');

const CourseCategory = require('../models/CourseCategory.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(CourseCategory), getCourseCategorys)
  .post(protect, authorize('Super Admin', 'Admin'), createCourseCategory);

router.route('/:id')
  .get(getCourseCategory)
  .put(protect, authorize('Super Admin', 'Admin'), updateCourseCategory)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteCourseCategory);

module.exports = router;