const Topper = require('../models/Topper.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createTopper = asyncHandler(async (req, res, next) => {
  const doc = await Topper.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getToppers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getTopper = asyncHandler(async (req, res, next) => {
  const doc = await Topper.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateTopper = asyncHandler(async (req, res, next) => {
  const doc = await Topper.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteTopper = asyncHandler(async (req, res, next) => {
  const doc = await Topper.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
