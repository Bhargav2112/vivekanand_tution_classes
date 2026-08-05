const Testimonial = require('../models/Testimonial.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createTestimonial = asyncHandler(async (req, res, next) => {
  const doc = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.submitTestimonial = asyncHandler(async (req, res, next) => {
  const { student_name, mobile, review } = req.body;
  if (!student_name || !review) {
    return res.status(400).json({ success: false, message: 'Please provide name and review' });
  }
  const doc = await Testimonial.create({
    type: 'text',
    student_name,
    mobile: mobile || '',
    review,
    status: 'inactive' // Requires admin approval
  });
  res.status(201).json({ success: true, data: doc });
});

exports.getTestimonials = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getTestimonial = asyncHandler(async (req, res, next) => {
  const doc = await Testimonial.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateTestimonial = asyncHandler(async (req, res, next) => {
  const doc = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
  const doc = await Testimonial.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});