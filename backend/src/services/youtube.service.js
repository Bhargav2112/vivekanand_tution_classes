const YoutubeChannel = require('../models/YoutubeChannel.model');
const YoutubeVideo = require('../models/YoutubeVideo.model');
const YoutubeSyncLog = require('../models/YoutubeSyncLog.model');

// Custom error for quota exceeded
class QuotaExceededError extends Error {
  constructor(message) {
    super(message);
    this.name = 'QuotaExceededError';
  }
}

// Ensure API key is configured
const getApiKey = () => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is not configured in .env');
  }
  return apiKey;
};

const getChannelId = () => {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    throw new Error('YOUTUBE_CHANNEL_ID is not configured in .env');
  }
  return channelId;
};

/**
 * Fetch and update channel details
 */
exports.syncChannelDetails = async () => {
  const apiKey = getApiKey();
  const channelId = getChannelId();
  
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics,brandingSettings&id=${channelId}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 403 && data.error?.errors?.[0]?.reason === 'quotaExceeded') {
      throw new QuotaExceededError('YouTube API Quota Exceeded.');
    }
    throw new Error(data.error?.message || 'Failed to fetch channel details');
  }
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found on YouTube');
  }
  
  const channelData = data.items[0];
  const snippet = channelData.snippet;
  const stats = channelData.statistics;
  const branding = channelData.brandingSettings;
  
  const updateData = {
    title: snippet.title,
    description: snippet.description,
    customUrl: snippet.customUrl,
    publishedAt: snippet.publishedAt,
    thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
    bannerUrl: branding?.image?.bannerExternalUrl,
    viewCount: stats.viewCount,
    subscriberCount: stats.subscriberCount,
    videoCount: stats.videoCount,
    uploadsPlaylistId: channelData.contentDetails.relatedPlaylists.uploads
  };
  
  const channel = await YoutubeChannel.findOneAndUpdate(
    { channelId },
    updateData,
    { new: true, upsert: true }
  );
  
  return channel;
};

/**
 * Check if a video is a YouTube Short
 * Uses a HEAD request to /shorts/{id}. If it redirects, it's a normal video.
 * If it returns 200 OK, it's a Short.
 * This saves API quota since it doesn't use the Data API.
 */
const isVideoShort = async (videoId) => {
  try {
    const response = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
      method: 'HEAD',
      redirect: 'manual' // Prevent following redirects
    });
    
    // 200 OK means it's a short. 301/302/303 means it's redirecting to /watch (normal video)
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error checking if ${videoId} is short:`, err.message);
    // Default to video on error
    return false;
  }
};

/**
 * Fetch all videos from a playlist (usually the 'uploads' playlist)
 */
exports.syncVideos = async (uploadsPlaylistId) => {
  const apiKey = getApiKey();
  const channelId = getChannelId();
  
  let nextPageToken = '';
  let hasNextPage = true;
  let totalProcessed = 0;
  let videosAdded = 0;
  let shortsAdded = 0;
  
  // We don't want to sync all history every time, but just get the newest ones.
  // The uploads playlist returns newest first.
  // We'll fetch pages until we see a video we already have in the DB.
  
  while (hasNextPage) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 403 && data.error?.errors?.[0]?.reason === 'quotaExceeded') {
        throw new QuotaExceededError('YouTube API Quota Exceeded.');
      }
      throw new Error(data.error?.message || 'Failed to fetch playlist items');
    }
    
    if (!data.items || data.items.length === 0) {
      break;
    }
    
    const videoIds = data.items.map(item => item.contentDetails.videoId);
    
    // Fetch video details (duration, stats, live status) using videos endpoint
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics,liveStreamingDetails&id=${videoIds.join(',')}&key=${apiKey}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    
    if (!videosResponse.ok) {
      throw new Error(videosData.error?.message || 'Failed to fetch video details');
    }
    
    let isAllExisting = true;
    
    for (const vData of videosData.items) {
      const videoId = vData.id;
      totalProcessed++;
      
      // Check if we already have it
      const existing = await YoutubeVideo.findOne({ videoId });
      
      if (!existing) {
        isAllExisting = false;
        
        // Determine if short
        const isShort = await isVideoShort(videoId);
        
        // Save new video
        await YoutubeVideo.create({
          videoId,
          type: isShort ? 'short' : 'video',
          title: vData.snippet.title,
          description: vData.snippet.description,
          thumbnailUrl: vData.snippet.thumbnails?.high?.url || vData.snippet.thumbnails?.medium?.url || vData.snippet.thumbnails?.default?.url,
          publishedAt: new Date(vData.snippet.publishedAt),
          channelId,
          duration: vData.contentDetails.duration, // format is PT#M#S
          viewCount: vData.statistics.viewCount || '0',
          likeCount: vData.statistics.likeCount || '0',
          commentCount: vData.statistics.commentCount || '0',
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
          liveBroadcastContent: vData.snippet.liveBroadcastContent || 'none',
          scheduledStartTime: vData.liveStreamingDetails?.scheduledStartTime ? new Date(vData.liveStreamingDetails.scheduledStartTime) : undefined
        });
        
        if (isShort) shortsAdded++;
        else videosAdded++;
      } else {
        // If it exists, we can still update its stats, but for optimization we might stop paginating
        // if we just want new videos. However, updating view counts is nice.
        await YoutubeVideo.updateOne({ videoId }, {
          viewCount: vData.statistics.viewCount || '0',
          likeCount: vData.statistics.likeCount || '0',
          commentCount: vData.statistics.commentCount || '0',
          title: vData.snippet.title, // In case title changed
          thumbnailUrl: vData.snippet.thumbnails?.high?.url || vData.snippet.thumbnails?.medium?.url || vData.snippet.thumbnails?.default?.url,
          liveBroadcastContent: vData.snippet.liveBroadcastContent || 'none',
          scheduledStartTime: vData.liveStreamingDetails?.scheduledStartTime ? new Date(vData.liveStreamingDetails.scheduledStartTime) : undefined
        });
      }
    }
    
    // If we only saw existing videos in this page, and we just want to fetch newest, we could break.
    // But let's fetch at least one full page to update stats.
    nextPageToken = data.nextPageToken;
    hasNextPage = !!nextPageToken;
    
    // Safety break to prevent consuming too much quota on massive channels during auto-sync
    if (totalProcessed >= 100) {
      break; 
    }
  }
  
  return { videosAdded, shortsAdded, totalProcessed };
};

exports.performSync = async (syncType = 'manual') => {
  const startTime = new Date();
  
  try {
    // 1. Sync Channel Details
    const channel = await exports.syncChannelDetails();
    
    // 2. Sync Videos & Shorts
    const { videosAdded, shortsAdded, totalProcessed } = await exports.syncVideos(channel.uploadsPlaylistId);
    
    // 3. Log Success
    const log = await YoutubeSyncLog.create({
      syncType,
      status: 'success',
      message: 'Sync completed successfully',
      videosAdded,
      shortsAdded,
      totalProcessed,
      startedAt: startTime,
      completedAt: new Date()
    });
    
    return log;
    
  } catch (error) {
    console.error('YouTube Sync Error:', error);
    
    // Log Failure
    await YoutubeSyncLog.create({
      syncType,
      status: 'failed',
      message: error.message,
      startedAt: startTime,
      completedAt: new Date()
    });
    
    throw error;
  }
};
