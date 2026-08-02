const Event = require('../models/Event.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createEvent = asyncHandler(async (req, res, next) => {
  const doc = await Event.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  const doc = await Event.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const doc = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const doc = await Event.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});