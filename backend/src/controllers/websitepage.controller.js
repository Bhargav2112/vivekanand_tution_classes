const WebsitePage = require('../models/WebsitePage.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createWebsitePage = asyncHandler(async (req, res, next) => {
  const doc = await WebsitePage.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getWebsitePages = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getWebsitePage = asyncHandler(async (req, res, next) => {
  const doc = await WebsitePage.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateWebsitePage = asyncHandler(async (req, res, next) => {
  const doc = await WebsitePage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteWebsitePage = asyncHandler(async (req, res, next) => {
  const doc = await WebsitePage.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});