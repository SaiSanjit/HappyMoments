const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const emailRoutes = require('./routes/email');
const likedVendorsRoutes = require('./routes/likedVendors');
const contactedVendorsRoutes = require('./routes/contactedVendors');
const couponsRoutes = require('./routes/coupons');
const adminNotificationsRoutes = require('./routes/adminNotifications');
const { initializeEmailService } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
// Basic helmet is applied above or specifically configured

// Rate limiting to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many email requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  }
});

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'https://happy-moments-eta.vercel.app',
    'https://happymomentsindia.com',
    'https://api.happymomentsindia.com',
    /^https:\/\/happy-moments.*\.vercel\.app$/
  ].filter(Boolean),
  credentials: true
}));

// Re-configure helmet to be more permissive for cross-origin resources in development
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable CSP for easier development
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to email routes
app.use('/api/email', limiter);

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/liked-vendors', likedVendorsRoutes);
app.use('/api/contacted-vendors', contactedVendorsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/admin-notifications', adminNotificationsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Event Vendor Email API'
  });
});

// Initialize email service
initializeEmailService();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Email API Server running on port ${PORT}`);
    console.log(`📧 Email service initialized`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  });
}

module.exports = app;
