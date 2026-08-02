const Banner = require('../models/Banner.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createBanner = asyncHandler(async (req, res, next) => {
  const doc = await Banner.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getBanners = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getBanner = asyncHandler(async (req, res, next) => {
  const doc = await Banner.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateBanner = asyncHandler(async (req, res, next) => {
  const doc = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteBanner = asyncHandler(async (req, res, next) => {
  const doc = await Banner.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
