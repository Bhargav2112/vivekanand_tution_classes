const ContactEnquiry = require('../models/ContactEnquiry.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createContactEnquiry = asyncHandler(async (req, res, next) => {
  const doc = await ContactEnquiry.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getContactEnquirys = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getContactEnquiry = asyncHandler(async (req, res, next) => {
  const doc = await ContactEnquiry.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateContactEnquiry = asyncHandler(async (req, res, next) => {
  const doc = await ContactEnquiry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteContactEnquiry = asyncHandler(async (req, res, next) => {
  const doc = await ContactEnquiry.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});