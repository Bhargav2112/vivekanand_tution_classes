const Result = require('../models/Result.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createResult = asyncHandler(async (req, res, next) => {
  const doc = await Result.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getResults = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getResult = asyncHandler(async (req, res, next) => {
  const doc = await Result.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateResult = asyncHandler(async (req, res, next) => {
  const doc = await Result.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteResult = asyncHandler(async (req, res, next) => {
  const doc = await Result.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});