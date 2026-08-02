const Gallery = require('../models/Gallery.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createGallery = asyncHandler(async (req, res, next) => {
  const doc = await Gallery.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getGallerys = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getGallery = asyncHandler(async (req, res, next) => {
  const doc = await Gallery.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateGallery = asyncHandler(async (req, res, next) => {
  const doc = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteGallery = asyncHandler(async (req, res, next) => {
  const doc = await Gallery.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});