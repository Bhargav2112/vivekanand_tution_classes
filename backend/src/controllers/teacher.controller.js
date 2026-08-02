const Teacher = require('../models/Teacher.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createTeacher = asyncHandler(async (req, res, next) => {
  const doc = await Teacher.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getTeachers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getTeacher = asyncHandler(async (req, res, next) => {
  const doc = await Teacher.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const doc = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteTeacher = asyncHandler(async (req, res, next) => {
  const doc = await Teacher.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});