const axios = require('axios');
const Setting = require('../models/Setting.model');
const asyncHandler = require('../middlewares/asyncHandler');

exports.getInstagramFeed = asyncHandler(async (req, res, next) => {
  const settings = await Setting.findOne();
  if (!settings || !settings.instagram_feed_enabled || !settings.instagram_token) {
    return res.status(400).json({ success: false, message: 'Instagram feed is disabled or token is missing' });
  }

  try {
    const limit = settings.instagram_post_count || 6;
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${settings.instagram_token}&limit=${limit}`;
    
    const response = await axios.get(url);
    
    res.status(200).json({ success: true, data: response.data.data });
  } catch (error) {
    console.error('Instagram API Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch Instagram feed' });
  }
});
