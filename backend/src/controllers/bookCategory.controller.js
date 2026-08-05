const BookCategory = require('../models/BookCategory.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createCategory = asyncHandler(async (req, res, next) => {
  const doc = await BookCategory.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const doc = await BookCategory.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const doc = await BookCategory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const doc = await BookCategory.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
