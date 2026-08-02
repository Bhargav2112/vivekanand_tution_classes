const Course = require('../models/Course.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createCourse = asyncHandler(async (req, res, next) => {
  const doc = await Course.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getCourses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getCourse = asyncHandler(async (req, res, next) => {
  const doc = await Course.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const doc = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const doc = await Course.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});