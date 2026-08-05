const PushSubscription = require('../models/PushSubscription.model');
const asyncHandler = require('../middlewares/asyncHandler');
const webpush = require('web-push');
const crypto = require('crypto');

// Generate VAPID keys if not set in env (Note: in production, set these in .env so they persist)
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuB-5LITIbQ0Nks7XwBIVW2KjE';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || 'NlJzZJ_bL3_Y0Z_d_u_b-R7b6_t_x_D_y_V_p_M_g_c';

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey);

exports.getVapidPublicKey = (req, res) => {
  res.status(200).json({ success: true, publicKey: publicVapidKey });
};

exports.subscribe = asyncHandler(async (req, res, next) => {
  const subscription = req.body;
  const userAgent = req.headers['user-agent'];

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ success: false, message: 'Invalid subscription object' });
  }

  // Upsert the subscription
  const doc = await PushSubscription.findOneAndUpdate(
    { endpoint: subscription.endpoint },
    { ...subscription, userAgent, isActive: true },
    { new: true, upsert: true }
  );

  res.status(201).json({ success: true, data: doc });
});

exports.unsubscribe = asyncHandler(async (req, res, next) => {
  const { endpoint } = req.body;
  if (!endpoint) {
    return res.status(400).json({ success: false, message: 'Endpoint is required' });
  }

  await PushSubscription.findOneAndDelete({ endpoint });
  res.status(200).json({ success: true, data: {} });
});

exports.sendNotification = asyncHandler(async (req, res, next) => {
  const { title, body, icon, url } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ success: false, message: 'Title and body are required' });
  }

  const payload = JSON.stringify({ title, body, icon, url });

  const subscriptions = await PushSubscription.find({ isActive: true });
  
  let successCount = 0;
  let failureCount = 0;

  const promises = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(sub, payload);
      successCount++;
    } catch (err) {
      console.error('Push notification failed for a subscriber:', err.statusCode);
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Subscription has expired or is no longer valid
        await PushSubscription.findByIdAndDelete(sub._id);
      }
      failureCount++;
    }
  });

  await Promise.all(promises);

  res.status(200).json({ 
    success: true, 
    message: 'Notifications sent', 
    stats: { total: subscriptions.length, success: successCount, failed: failureCount } 
  });
});
