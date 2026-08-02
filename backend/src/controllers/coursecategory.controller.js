const CourseCategory = require('../models/CourseCategory.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createCourseCategory = asyncHandler(async (req, res, next) => {
  const doc = await CourseCategory.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getCourseCategorys = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getCourseCategory = asyncHandler(async (req, res, next) => {
  const doc = await CourseCategory.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateCourseCategory = asyncHandler(async (req, res, next) => {
  const doc = await CourseCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteCourseCategory = asyncHandler(async (req, res, next) => {
  const doc = await CourseCategory.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});