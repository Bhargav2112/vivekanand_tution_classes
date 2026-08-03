const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { errorHandler, notFound } = require('./src/middlewares/error.middleware');

const rateLimit = require('express-rate-limit');

const app = express();

// CORS configuration (Must be first to avoid preflight/CORS blocks on rate limits or errors)
const allowedOrigins = [
  process.env.FRONTEND_USER_URL,
  process.env.FRONTEND_ADMIN_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
].map(url => url ? url.replace(/\/$/, '') : null).filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};
app.options('*', cors(corsOptions)); // handle preflight requests for all routes
app.use(cors(corsOptions));

// Security Middlewares
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2000 // limit each IP to 2000 requests per windowMs (prevents rate limit issues during active usage/development)
});
app.use(limiter);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(hpp());

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve static files from public/uploads
app.use('/public', express.static('public'));

// Basic Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: "Vivekanand Tuition Classes API",
    version: "1.0.0",
    status: "Running"
  });
});
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Route files
const authRoutes = require('./src/routes/auth.routes');

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admins', require('./src/routes/admin.routes'));
app.use('/api/v1/teachers', require('./src/routes/teacher.routes'));
app.use('/api/v1/students', require('./src/routes/student.routes'));
app.use('/api/v1/admissions', require('./src/routes/admission.routes'));
app.use('/api/v1/courses', require('./src/routes/course.routes'));
app.use('/api/v1/coursecategories', require('./src/routes/coursecategory.routes'));
app.use('/api/v1/batches', require('./src/routes/batch.routes'));
app.use('/api/v1/results', require('./src/routes/result.routes'));
app.use('/api/v1/galleries', require('./src/routes/gallery.routes'));
app.use('/api/v1/videos', require('./src/routes/video.routes'));
app.use('/api/v1/shortvideos', require('./src/routes/shortVideo.routes'));
app.use('/api/v1/testimonials', require('./src/routes/testimonial.routes'));
app.use('/api/v1/events', require('./src/routes/event.routes'));
app.use('/api/v1/notices', require('./src/routes/notice.routes'));
app.use('/api/v1/blogs', require('./src/routes/blog.routes'));
app.use('/api/v1/faqs', require('./src/routes/faq.routes'));
app.use('/api/v1/websitepages', require('./src/routes/websitepage.routes'));
app.use('/api/v1/seos', require('./src/routes/seo.routes'));
app.use('/api/v1/settings', require('./src/routes/setting.routes'));
app.use('/api/v1/banners', require('./src/routes/banner.routes'));
app.use('/api/v1/contactenquiries', require('./src/routes/contactenquiry.routes'));
app.use('/api/v1/newsletters', require('./src/routes/newsletter.routes'));
app.use('/api/v1/downloads', require('./src/routes/download.routes'));
app.use('/api/v1/upload', require('./src/routes/upload.routes'));
app.use('/api/v1/youtube', require('./src/routes/youtube.routes'));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
