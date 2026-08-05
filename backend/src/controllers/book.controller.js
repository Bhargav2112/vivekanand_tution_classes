const Book = require('../models/Book.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createBook = asyncHandler(async (req, res, next) => {
  const doc = await Book.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getBooks = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const doc = await Book.findById(req.params.id).populate('category');
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const doc = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const doc = await Book.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
