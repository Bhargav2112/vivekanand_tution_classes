const FAQ = require('../models/FAQ.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createFAQ = asyncHandler(async (req, res, next) => {
  const doc = await FAQ.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getFAQs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getFAQ = asyncHandler(async (req, res, next) => {
  const doc = await FAQ.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateFAQ = asyncHandler(async (req, res, next) => {
  const doc = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteFAQ = asyncHandler(async (req, res, next) => {
  const doc = await FAQ.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});