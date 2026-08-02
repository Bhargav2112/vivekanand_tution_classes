const Blog = require('../models/Blog.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createBlog = asyncHandler(async (req, res, next) => {
  const doc = await Blog.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getBlogs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getBlog = asyncHandler(async (req, res, next) => {
  const doc = await Blog.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
  const doc = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const doc = await Blog.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});