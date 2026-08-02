const Setting = require('../models/Setting.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createSetting = asyncHandler(async (req, res, next) => {
  const doc = await Setting.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getSettings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getSetting = asyncHandler(async (req, res, next) => {
  const doc = await Setting.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateSetting = asyncHandler(async (req, res, next) => {
  const doc = await Setting.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteSetting = asyncHandler(async (req, res, next) => {
  const doc = await Setting.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});