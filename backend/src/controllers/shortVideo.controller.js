const ShortVideo = require('../models/ShortVideo.model');
const asyncHandler = require('../middlewares/asyncHandler');

function extractYouTubeThumbnail(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return '';
}

exports.createShortVideo = asyncHandler(async (req, res, next) => {
  if (!req.body.thumbnail_url && req.body.youtube_url) {
    req.body.thumbnail_url = extractYouTubeThumbnail(req.body.youtube_url);
  }
  const doc = await ShortVideo.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getShortVideos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getShortVideo = asyncHandler(async (req, res, next) => {
  const doc = await ShortVideo.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateShortVideo = asyncHandler(async (req, res, next) => {
  if (!req.body.thumbnail_url && req.body.youtube_url) {
    req.body.thumbnail_url = extractYouTubeThumbnail(req.body.youtube_url);
  }
  const doc = await ShortVideo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteShortVideo = asyncHandler(async (req, res, next) => {
  const doc = await ShortVideo.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
