require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./src/database/connection');

const PORT = process.env.PORT || 5000;

// Create HTTP server exactly once
const server = http.createServer(app);

const cloudinary = require('cloudinary').v2;

// Connect to Database
connectDB();

// Test Cloudinary Credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

cloudinary.api.ping()
  .then(() => console.log(`✅ Cloudinary Configured & Connected Successfully (Cloud: ${process.env.CLOUDINARY_NAME})`))
  .catch((err) => console.error(`❌ Cloudinary Connection Error: ${err.message}`));

const initYoutubeCron = require('./src/cron/youtube.cron');

// Start Server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  initYoutubeCron();
});

// Handle unhandled promise rejections without crashing the server
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  console.error(err);
});

// Graceful shutdown using modern Promise-based Mongoose 9 API
const gracefulShutdown = () => {
  console.info('Shutdown signal received.');
  console.log('Closing HTTP server.');
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
