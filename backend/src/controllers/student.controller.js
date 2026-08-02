const Student = require('../models/Student.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createStudent = asyncHandler(async (req, res, next) => {
  const doc = await Student.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getStudents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getStudent = asyncHandler(async (req, res, next) => {
  const doc = await Student.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateStudent = asyncHandler(async (req, res, next) => {
  const doc = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const doc = await Student.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});