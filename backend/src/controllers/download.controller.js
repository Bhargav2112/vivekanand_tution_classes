const Download = require('../models/Download.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createDownload = asyncHandler(async (req, res, next) => {
  const doc = await Download.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getDownloads = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getDownload = asyncHandler(async (req, res, next) => {
  const doc = await Download.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateDownload = asyncHandler(async (req, res, next) => {
  const doc = await Download.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteDownload = asyncHandler(async (req, res, next) => {
  const doc = await Download.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});