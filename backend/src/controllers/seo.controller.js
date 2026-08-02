const SEO = require('../models/SEO.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createSEO = asyncHandler(async (req, res, next) => {
  const doc = await SEO.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getSEOs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getSEO = asyncHandler(async (req, res, next) => {
  const doc = await SEO.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateSEO = asyncHandler(async (req, res, next) => {
  const doc = await SEO.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteSEO = asyncHandler(async (req, res, next) => {
  const doc = await SEO.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});