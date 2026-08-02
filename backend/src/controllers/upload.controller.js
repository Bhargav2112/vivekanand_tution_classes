const asyncHandler = require('../middlewares/asyncHandler');
const cloudinary = require('cloudinary').v2;

// @desc    Upload single image
// @route   POST /api/v1/upload/image
// @access  Private (Admin)
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }
  res.status(200).json({
    success: true,
    data: {
      url: req.file.path,
      public_id: req.file.filename
    }
  });
});

// @desc    Upload multiple images
// @route   POST /api/v1/upload/images
// @access  Private (Admin)
exports.uploadImages = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Please upload at least one image' });
  }
  
  const uploadedFiles = req.files.map(file => ({
    url: file.path,
    public_id: file.filename
  }));

  res.status(200).json({
    success: true,
    data: uploadedFiles
  });
});

// @desc    Upload PDF
// @route   POST /api/v1/upload/pdf
// @access  Private (Admin)
exports.uploadPdf = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a PDF file' });
  }
  res.status(200).json({
    success: true,
    data: {
      url: req.file.path,
      public_id: req.file.filename
    }
  });
});

// @desc    Delete Cloudinary file
// @route   DELETE /api/v1/upload/image/:public_id
// @access  Private (Admin)
exports.deleteImage = asyncHandler(async (req, res, next) => {
  // Cloudinary public_ids often contain slashes (e.g. vivekanand_uploads/images/abc)
  // We expect the frontend to pass the public_id properly, maybe URL encoded.
  const publicId = req.query.public_id || req.params.public_id;
  
  if (!publicId) {
    return res.status(400).json({ success: false, message: 'Please provide a public_id' });
  }

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== 'ok') {
    return res.status(400).json({ success: false, message: 'Failed to delete image from Cloudinary' });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});
