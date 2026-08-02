const Admission = require('../models/Admission.model');
const Student = require('../models/Student.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createAdmission = asyncHandler(async (req, res, next) => {
  const body = { status: 'pending', ...req.body };
  const doc = await Admission.create(body);

  // Auto-sync Student record ONLY IF status is 'approved'
  if (doc.status === 'approved') {
    try {
      await Student.create({
        name: doc.student_name,
        photo_url: doc.photo_url || '',
        course: doc.course,
        mobile: doc.mobile || '',
        parent_name: doc.parent_name || '',
        parent_mobile: doc.parent_mobile || '',
        address: doc.address || '',
        admission_status: 'active'
      });
    } catch (err) {
      console.error("Auto student creation note:", err.message);
    }
  }

  res.status(201).json({ success: true, data: doc });
});

exports.getAdmissions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getAdmission = asyncHandler(async (req, res, next) => {
  const doc = await Admission.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateAdmission = asyncHandler(async (req, res, next) => {
  const doc = await Admission.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }

  // Auto-sync Student record ONLY IF status is 'approved'
  if (doc.status === 'approved') {
    try {
      const cleanMobile = String(doc.mobile || '').replace(/\D/g, '').slice(-10);
      const cleanName = String(doc.student_name || '').trim().toLowerCase();

      const allStudents = await Student.find();
      const existing = allStudents.find(s => {
        const sMobile = String(s.mobile || '').replace(/\D/g, '').slice(-10);
        const sName = String(s.name || '').trim().toLowerCase();
        return (cleanName && sName === cleanName) || (cleanMobile && sMobile && sMobile === cleanMobile);
      });

      if (!existing) {
        await Student.create({
          name: doc.student_name,
          photo_url: doc.photo_url || '',
          course: doc.course,
          mobile: doc.mobile || '',
          parent_name: doc.parent_name || '',
          parent_mobile: doc.parent_mobile || '',
          address: doc.address || '',
          admission_status: 'active'
        });
      } else {
        await Student.findByIdAndUpdate(existing._id, {
          name: doc.student_name,
          photo_url: doc.photo_url || existing.photo_url,
          course: doc.course || existing.course,
          mobile: doc.mobile || existing.mobile,
          parent_name: doc.parent_name || existing.parent_name,
          address: doc.address || existing.address
        });
      }
    } catch (err) {
      console.error("Auto student update note:", err.message);
    }
  } else {
    // If status is changed back to pending or rejected, remove from Students list
    try {
      await Student.deleteMany({ name: doc.student_name, mobile: doc.mobile });
    } catch (err) {
      console.error("Auto student cleanup note:", err.message);
    }
  }

  res.status(200).json({ success: true, data: doc });
});

exports.deleteAdmission = asyncHandler(async (req, res, next) => {
  const doc = await Admission.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});