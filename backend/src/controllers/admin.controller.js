const Admin = require('../models/Admin.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createAdmin = asyncHandler(async (req, res, next) => {
  const doc = await Admin.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getAdmins = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getAdmin = asyncHandler(async (req, res, next) => {
  const doc = await Admin.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateAdmin = asyncHandler(async (req, res, next) => {
  const doc = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteAdmin = asyncHandler(async (req, res, next) => {
  const doc = await Admin.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});