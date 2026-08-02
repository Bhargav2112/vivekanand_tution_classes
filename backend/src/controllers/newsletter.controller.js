const Newsletter = require('../models/Newsletter.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createNewsletter = asyncHandler(async (req, res, next) => {
  const doc = await Newsletter.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getNewsletters = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getNewsletter = asyncHandler(async (req, res, next) => {
  const doc = await Newsletter.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateNewsletter = asyncHandler(async (req, res, next) => {
  const doc = await Newsletter.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteNewsletter = asyncHandler(async (req, res, next) => {
  const doc = await Newsletter.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});