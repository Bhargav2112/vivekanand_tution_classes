const cron = require('node-cron');
const youtubeService = require('../services/youtube.service');

const initYoutubeCron = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('[Cron] Running YouTube Auto-Sync...');
    try {
      // Check if API key and channel ID are configured first to avoid throwing unhandled errors if they aren't
      if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
        console.log('[Cron] YouTube Sync skipped: API Key or Channel ID missing in .env');
        return;
      }
      
      const log = await youtubeService.performSync('auto');
      console.log(`[Cron] YouTube Sync Success: Added ${log.videosAdded} videos, ${log.shortsAdded} shorts.`);
    } catch (error) {
      console.error('[Cron] YouTube Sync Failed:', error.message);
    }
  });
  
  console.log('YouTube Auto-Sync Cron Job initialized (Runs every 30 mins).');
};

module.exports = initYoutubeCron;
