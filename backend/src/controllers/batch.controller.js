const Batch = require('../models/Batch.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createBatch = asyncHandler(async (req, res, next) => {
  const doc = await Batch.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getBatchs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getBatch = asyncHandler(async (req, res, next) => {
  const doc = await Batch.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateBatch = asyncHandler(async (req, res, next) => {
  const doc = await Batch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteBatch = asyncHandler(async (req, res, next) => {
  const doc = await Batch.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});