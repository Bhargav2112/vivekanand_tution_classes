const Notice = require('../models/Notice.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createNotice = asyncHandler(async (req, res, next) => {
  const doc = await Notice.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getNotices = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getNotice = asyncHandler(async (req, res, next) => {
  const doc = await Notice.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateNotice = asyncHandler(async (req, res, next) => {
  const doc = await Notice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteNotice = asyncHandler(async (req, res, next) => {
  const doc = await Notice.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});