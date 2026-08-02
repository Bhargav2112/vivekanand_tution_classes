const Video = require('../models/Video.model');
const asyncHandler = require('../middlewares/asyncHandler');

function extractYouTubeThumbnail(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
  }
  return '';
}

exports.createVideo = asyncHandler(async (req, res, next) => {
  if (!req.body.thumbnail_url && req.body.youtube_url) {
    req.body.thumbnail_url = extractYouTubeThumbnail(req.body.youtube_url);
  }
  const doc = await Video.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

exports.getVideos = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getVideo = asyncHandler(async (req, res, next) => {
  const doc = await Video.findById(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.updateVideo = asyncHandler(async (req, res, next) => {
  if (!req.body.thumbnail_url && req.body.youtube_url) {
    req.body.thumbnail_url = extractYouTubeThumbnail(req.body.youtube_url);
  }
  const doc = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: doc });
});

exports.deleteVideo = asyncHandler(async (req, res, next) => {
  const doc = await Video.findByIdAndDelete(req.params.id);
  if (!doc) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  res.status(200).json({ success: true, data: {} });
});